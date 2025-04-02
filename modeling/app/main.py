from fastapi import FastAPI, HTTPException, Request
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel
from typing import Dict, Any, List
import os
import logging
import json
import numpy as np
import tensorflow as tf
from pyspark.sql.functions import udf, col
from pyspark.sql.types import DoubleType, IntegerType
from pydantic import BaseModel
from .model_schema import prediction_schema
from data.imputing_data import run_imputation
from tensorflow import keras
from tensorflow.keras.utils import register_keras_serializable

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logging.getLogger("py4j").setLevel(logging.ERROR)
logging.getLogger("pyspark").setLevel(logging.ERROR)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI(debug=True)

# 요청 및 응답 모델
class PredictionRequest(BaseModel):
    features: Dict[str, Any]

class PredictionResponse(BaseModel):
    prediction: float

# 전역 변수 - Spark 세션, 모델들
spark = None
timeseries_model = None
behavior_model = None
record_model = None
kmeans_model = None
final_model = None

@register_keras_serializable()
def auc_loss(y_true, y_pred):
    """AUC를 최대화하기 위한 커스텀 손실 함수"""
    # y_true와 y_pred를 1D 텐서로 변환
    y_true = tf.cast(tf.reshape(y_true, [-1]), tf.float32)
    y_pred = tf.reshape(y_pred, [-1])
    
    # 양성/음성 샘플 분리
    pos_indices = tf.where(y_true == 1.0)
    neg_indices = tf.where(y_true == 0.0)
    
    # 양성/음성 예측값 획득
    pos_preds = tf.gather(y_pred, pos_indices)
    neg_preds = tf.gather(y_pred, neg_indices)
    
    # 모든 양성/음성 쌍에 대해 손실 계산
    pos_preds_expanded = tf.expand_dims(pos_preds, 1)
    neg_preds_expanded = tf.expand_dims(neg_preds, 0)
    
    # RankNet 기반 AUC 최적화 손실 (1 - sigmoid(pos_pred - neg_pred))
    diff = pos_preds_expanded - neg_preds_expanded
    loss = tf.reduce_mean(1.0 - tf.sigmoid(diff))
    
    # 기본 BCE 손실과의 조합
    binary_loss = tf.keras.losses.binary_crossentropy(y_true, y_pred)
    
    # 두 손실 함수의 가중합
    alpha = 0.7  # 가중치 조정
    combined_loss = alpha * loss + (1 - alpha) * binary_loss
    
    return combined_loss

@app.on_event("startup")
async def startup_event():
    global spark, timeseries_model, behavior_model, record_model, kmeans_model, final_model
    
    # 가벼운 Spark 세션 초기화
    logger.info("가벼운 Spark 세션 초기화 중...")
    spark = SparkSession.builder \
        .appName("FastAPI-PySpark-Lightweight") \
        .config("spark.driver.cores", "1") \
        .config("spark.executor.cores", "1") \
        .config("spark.driver.memory", "512m") \
        .config("spark.memory.offHeap.enabled", "true") \
        .config("spark.memory.offHeap.size", "256m") \
        .config("spark.driver.maxResultSize", "256m") \
        .config("spark.memory.fraction", "0.6") \
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
        .config("spark.kryo.unsafe", "true") \
        .config("spark.sql.shuffle.partitions", "1") \
        .getOrCreate()

    # 모델 로드 - 각 단계별 SparkML 모델
    model_base_path = os.environ.get("MODEL_BASE_PATH", "./models")
    
    try:
        # 1. timeseries 모델 로드
        timeseries_path = os.path.join(model_base_path, "timeseries_model")
        logger.info(f"timeseries 모델 로드 중: {timeseries_path}")
        timeseries_model = PipelineModel.load(timeseries_path)
        
        # 2. behavior 모델 로드
        behavior_path = os.path.join(model_base_path, "behavior_model")
        logger.info(f"behavior 모델 로드 중: {behavior_path}")
        behavior_model = PipelineModel.load(behavior_path)
        
        # 3. record 모델 로드
        record_path = os.path.join(model_base_path, "record_model")
        logger.info(f"record 모델 로드 중: {record_path}")
        record_model = PipelineModel.load(record_path)
        
        # 4. kmeans 모델 로드
        kmeans_path = os.path.join(model_base_path, "kmeans_model")
        logger.info(f"kmeans 모델 로드 중: {kmeans_path}")
        kmeans_model = PipelineModel.load(kmeans_path)
        
        # 5. 최종 Keras 모델 로드
        keras_model_path = os.path.join(model_base_path, "final_model.keras")
        logger.info(f"Keras 최종 모델 로드 중: {keras_model_path}")
        final_model = tf.keras.models.load_model(keras_model_path)
        
        logger.info("모든 모델 로드 완료")
    except Exception as e:
        logger.error(f"모델 로드 실패: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    global spark
    if spark:
        spark.stop()
        logger.info("Spark 세션 종료됨")

@app.get("/")
async def root():
    return {"status": "active", "message": "AI 모델 API가 실행 중입니다"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    global spark, timeseries_model, behavior_model, record_model, kmeans_model, final_model
    
    # 모든 모델이 준비되었는지 확인
    if (spark is None or timeseries_model is None or behavior_model is None or 
        record_model is None or kmeans_model is None or final_model is None):
        raise HTTPException(status_code=503, detail="모델 또는 Spark 세션이 준비되지 않았습니다.")
    
    try:
        # 결과 배열 초기화
        prediction_array = []
        
        # case_id 추출 (배열의 첫 번째 요소로 사용)
        input_data = request.features
        case_id = input_data.get("case_id", -1)
        prediction_array.append(float(case_id))
        
        # 1. 결측치 처리
        logger.info("1단계: 결측치 처리 중...")
        distribution_pkl_path = "./data/distribution_info.pkl"
        # 수정된 코드
        # 입력 데이터가 이미 딕셔너리인지 확인
        if isinstance(input_data, dict):
            input_data_json = json.dumps(input_data)
        else:
            input_data_json = input_data

        imputed_data_str = run_imputation(input_data_json, distribution_pkl_path)
        logger.info("결측치 처리 완료")

        # 문자열을 딕셔너리로 변환 
        if isinstance(imputed_data_str, str):
            imputed_data = json.loads(imputed_data_str)
        else:
            imputed_data = imputed_data_str
        
        # Spark DataFrame 생성
        input_df = spark.createDataFrame([imputed_data])
        
        # 확률 추출을 위한 UDF 정의 (긍정 클래스의 확률 추출)
        probability_udf = udf(lambda v: float(v[1]) if v is not None else None, DoubleType())
        
        # 2. timeseries 모델 실행 및 확률값 추출
        logger.info("2단계: timeseries 모델 실행 중...")
        ts_result = timeseries_model.transform(input_df)
        ts_prob = ts_result.select(probability_udf(col("probability"))).collect()[0][0]
        prediction_array.append(float(ts_prob))
        logger.info(f"timeseries 모델 확률값: {ts_prob}")
        
        # 3. behavior 모델 실행 및 확률값 추출
        logger.info("3단계: behavior 모델 실행 중...")
        bh_result = behavior_model.transform(input_df)
        bh_prob = bh_result.select(probability_udf(col("probability"))).collect()[0][0]
        prediction_array.append(float(bh_prob))
        logger.info(f"behavior 모델 확률값: {bh_prob}")
        
        # 4. record 모델 실행 및 확률값 추출
        logger.info("4단계: record 모델 실행 중...")
        rc_result = record_model.transform(input_df)
        rc_prob = rc_result.select(probability_udf(col("probability"))).collect()[0][0]
        prediction_array.append(float(rc_prob))
        logger.info(f"record 모델 확률값: {rc_prob}")
        
        # 5. kmeans 모델 실행 및 클러스터 ID 추출
        logger.info("5단계: kmeans 모델 실행 중...")
        km_result = kmeans_model.transform(input_df)
        cluster_id = km_result.select("prediction").collect()[0][0]
        prediction_array.append(float(cluster_id))
        logger.info(f"kmeans 모델 클러스터 ID: {cluster_id}")
        
        # 6. 최종 keras 모델 예측
        logger.info("6단계: 최종 keras 모델 예측 중...")
        # 모델 입력을 위한 특성 배열 생성 (앞의 모델들의 결과)
        model_features = [ts_prob, bh_prob, rc_prob, cluster_id]
        
        # 모델 입력을 numpy 배열로 변환
        input_array = np.array([model_features])
        
        # 최종 예측 수행
        final_result = final_model.predict(input_array)[0][0]
        prediction_array.append(float(final_result))
        logger.info(f"최종 예측 결과: {final_result}")
        
        # 전체 예측 배열 반환
        return PredictionResponse(prediction=final_result)
    
    except Exception as e:
        logger.error(f"예측 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    global spark, timeseries_model, behavior_model, record_model, kmeans_model, final_model
    health_status = {
        "status": "healthy",
        "spark_active": not spark._jsc.sc().isStopped() if spark else False,
        "timeseries_model_loaded": timeseries_model is not None,
        "behavior_model_loaded": behavior_model is not None,
        "record_model_loaded": record_model is not None,
        "kmeans_model_loaded": kmeans_model is not None,
        "keras_model_loaded": final_model is not None
    }
    
    if (not health_status["spark_active"] or 
        not health_status["timeseries_model_loaded"] or 
        not health_status["behavior_model_loaded"] or 
        not health_status["record_model_loaded"] or 
        not health_status["kmeans_model_loaded"] or 
        not health_status["keras_model_loaded"]):
        raise HTTPException(status_code=503, detail="서비스가 완전히 작동하지 않습니다")
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)