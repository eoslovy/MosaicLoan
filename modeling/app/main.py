from fastapi import FastAPI, HTTPException, Request
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel
from typing import Dict, Any, List
import os
import logging
from pydantic import BaseModel

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI()

# 요청 및 응답 모델
class PredictionRequest(BaseModel):
    features: Dict[str, Any]

class PredictionResponse(BaseModel):
    prediction: List[Any]

# 전역 변수 - Spark 세션 및 모델
spark = None
model = None

@app.on_event("startup")
async def startup_event():
    global spark, model
    
    # Spark 세션 초기화
    logger.info("Spark 세션 초기화 중...")
    spark = SparkSession.builder \
        .appName("FastAPI-PySpark") \
        .config("spark_ensemble.executor.cores", "8") \
        .config("spark_ensemble.driver.memory", "16g") \
        .config("spark_ensemble.executor.memory", "24g") \
        .config("spark_ensemble.driver.maxResultSize", "8g") \
        .config("spark_ensemble.memory.fraction", "0.8") \
        .master("local[*]") \
        .getOrCreate()
    
    # 모델 로드
    model_path = os.environ.get("MODEL_PATH", "./models/spark_model")
    try:
        logger.info(f"모델 로드 중: {model_path}")
        model = PipelineModel.load(model_path)
        logger.info("모델 로드 완료")
    except Exception as e:
        logger.error(f"모델 로드 실패: {e}")
        # 여기서는 오류가 발생해도 서버는 시작됨 (선택사항: 오류 발생 시 서버 시작 방지 가능)

@app.on_event("shutdown")
async def shutdown_event():
    global spark
    if spark:
        spark.stop()
        logger.info("Spark 세션 종료됨")

@app.get("/")
async def root():
    return {"status": "active", "message": "PySpark Model API is running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    global spark, model
    
    # Spark나 모델이 준비되지 않았는지 확인
    if spark is None or model is None:
        raise HTTPException(status_code=503, detail="모델 또는 Spark 세션이 준비되지 않았습니다.")
    
    try:
        # Dict를 Spark DataFrame으로 변환
        input_df = spark.createDataFrame([request.features])
        
        # 모델 예측 수행
        result_df = model.transform(input_df)
        
        # 확률 추출을 위한 UDF 정의 (부도 클래스의 확률 추출)
        from pyspark.sql.functions import udf, col
        from pyspark.sql.types import DoubleType
        
        # 부도 클래스(일반적으로 인덱스 1)의 확률 추출
        probability_udf = udf(lambda v: float(v[1]) if v is not None else None, DoubleType())
        
        # 확률값 추출
        probability = float(result_df.select(probability_udf(col("probability"))).collect()[0][0])
        
        return PredictionResponse(prediction=probability)
    except Exception as e:
        logger.error(f"예측 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    global spark, model
    health_status = {
        "status": "healthy",
        "spark_active": not spark._jsc.sc().isStopped() if spark else False,
        "model_loaded": model is not None
    }
    
    if not health_status["spark_active"] or not health_status["model_loaded"]:
        raise HTTPException(status_code=503, detail="Service not fully operational")
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)