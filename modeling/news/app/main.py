# main.py
import sys
import os
# 현재 파일의 디렉토리 경로를 sys.path에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# 상위 디렉토리도 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from typing import List, Dict, Any, Optional
import logging
import time
import gdown
import json
from pydantic import BaseModel
import torch
from datetime import datetime, timedelta
from dotenv import load_dotenv
import pymysql

# model_service 클래스 import
from app.services.model_service import EconomicNewsModelService

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI(debug=True, title="텍스트 분석 API", description="LDA 및 BERT 모델을 사용한 텍스트 분석 API")

# 요청 및 응답 모델
class TextRequest(BaseModel):
    text: str
    options: Optional[Dict[str, Any]] = None

class ArticlesRequest(BaseModel):
    articles: List[Dict[str, Any]]

class ArticleAnalyzeResponse(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    is_economic: bool
    economic_probability: float
    sentiment_score: float
    sentiment_category: str

class AnalyzeResponse(BaseModel):
    is_economic: bool
    economic_probability: float
    sentiment_score: float
    sentiment_category: str
    processing_time: float

class S3AnalysisResponse(BaseModel):
    days_analyzed: int
    average_sentiment_score: float
    sentiment_distribution: Dict[str, int]
    total_articles: int
    economic_articles: int
    article_results: Optional[List[ArticleAnalyzeResponse]] = None

# 전역 변수
model_service = None
models_downloaded = False


def get_db_connection():
    """데이터베이스 연결을 반환하는 함수"""
    try:
        # .env 파일 로드 (아직 로드되지 않았다면)
        from dotenv import load_dotenv
        load_dotenv()
        
        # 환경 변수에서 연결 정보 가져오기
        db_url = os.getenv('CREDIT_DATASOURCE_URL_FOR_NEWS')
        username = os.getenv('CREDIT_DATASOURCE_USERNAME')
        password = os.getenv('CREDIT_DATASOURCE_PASSWORD')
        
        # URL에서 호스트, 포트, DB 이름 파싱
        host_port_db = db_url.split('//')[1]
        host_port = host_port_db.split('/')[0]
        db_name = host_port_db.split('/')[1]
        
        host = host_port.split(':')[0]
        port = int(host_port.split(':')[1])
        
        # 연결 정보 로깅 (비밀번호는 제외)
        logger.info(f"DB 연결 정보: host={host}, port={port}, db={db_name}, user={username}")
        
        # 연결 시도
        conn = pymysql.connect(
            host=host,
            user=username,
            password=password,
            db=db_name,
            port=port,
            charset='utf8mb4'
        )
        logger.info("DB 연결 성공")
        return conn
        
    except Exception as e:
        logger.error(f"데이터베이스 연결 중 오류: {e}")
        raise


# # DB 연결 함수
# def get_db_connection():
#     """데이터베이스 연결을 반환하는 함수"""
#     try:
#         conn = pymysql.connect(
#             host=os.getenv('CREDIT_DATASOURCE_URL').split('//')[1].split(':')[0],
#             user=os.getenv('CREDIT_DATASOURCE_USERNAME'),
#             password=os.getenv('CREDIT_DATASOURCE_PASSWORD'),
#             db=os.getenv('CREDIT_DATASOURCE_URL').split('/')[-1],
#             port=int(os.getenv('CREDIT_DATASOURCE_URL').split(':')[2].split('/')[0]),
#             charset='utf8mb4'
#         )
#         return conn
#     except Exception as e:
#         logger.error(f"데이터베이스 연결 중 오류: {e}")
#         raise

# 모델 파일 ID
model_file_ids = {
    "lda_dictionary.dict": "17eUA3xeHhcL_Fpvwrzo8SRpOg1KIpWgj",
    "lda_model.model": "1kLnhX1izx5WRYGAASf_6HKkLMLGxOvMD",
    "lda_model.model.expElogbeta.npy": "1YGNL1JrRKVVJCrtgLzY_qkuzqX5wPxcy",
    "lda_model.model.id2word": "1UGHI-UnBH7kBpcQgLOu12Nq8WBIiLhBi",
    "lda_model.model.state": "1niADuWi-l4Hz7k13RIrjiA-V7V0zPk1L",
    "best_klue_bert_economic_sentiment_regression.pt": "1niCfgyeavYie5nsiHuwO03fQ-b0FP2Hz"
}

def download_model_from_drive(file_id, destination_path):
    """구글 드라이브에서 모델 파일 다운로드"""
    try:
        logger.info(f"모델 다운로드 중: {destination_path}")
        
        # 디렉토리 생성
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        
        # 구글 드라이브에서 파일 다운로드
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, destination_path, quiet=False)
        
        # 다운로드 확인
        if not os.path.exists(destination_path):
            logger.error(f"다운로드 실패: {destination_path}")
            return False
        
        file_size = os.path.getsize(destination_path)
        logger.info(f"다운로드 완료: {destination_path} (크기: {file_size} 바이트)")
        return True
    
    except Exception as e:
        logger.error(f"모델 다운로드 중 오류: {str(e)}", exc_info=True)
        return False

async def download_all_models(background_tasks: BackgroundTasks):
    """모든 모델 파일 다운로드"""
    global models_downloaded
    
    # 모델 저장 디렉토리
    model_base_path = os.environ.get("MODEL_BASE_PATH", 
                                    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models"))
    os.makedirs(model_base_path, exist_ok=True)
    
    # 각 모델 파일 다운로드
    for filename, file_id in model_file_ids.items():
        dest_path = os.path.join(model_base_path, filename)
        
        # 이미 파일이 있는지 확인
        if os.path.exists(dest_path):
            logger.info(f"모델 파일이 이미 존재합니다: {dest_path}")
            continue
        
        # 다운로드
        success = download_model_from_drive(file_id, dest_path)
        if not success:
            logger.error(f"파일 다운로드 실패: {filename}")
            return False
    
    # 모든 파일이 있는지 확인
    all_files_exist = all(os.path.exists(os.path.join(model_base_path, filename)) 
                          for filename in model_file_ids.keys())
    
    models_downloaded = all_files_exist
    logger.info(f"모든 모델 다운로드 상태: {'완료' if models_downloaded else '실패'}")
    return models_downloaded

def load_model_service():
    """모델 서비스 로드"""
    global model_service
    
    # 모델 경로 설정
    model_base_path = os.environ.get("MODEL_BASE_PATH", 
                                     os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models"))
    
    try:
        # 모델 서비스 인스턴스 생성
        model_service = EconomicNewsModelService(
            base_path=model_base_path,
            lda_model_name='lda_model',
            lda_dict_name='lda_dictionary',
            bert_model_name='best_klue_bert_economic_sentiment_regression.pt'
        )
        
        # 모델 로드
        success = model_service.load_models()
        return success
    
    except Exception as e:
        logger.error(f"모델 서비스 초기화 오류: {e}", exc_info=True)
        return False

# 환경변수 설정을 위한 함수
def setup_aws_env():
    """
    .env 파일과 환경변수에서 AWS 관련 설정을 로드합니다.
    .env 파일에 없는 경우 환경변수를 확인하고, 둘 다 없으면 기본값 사용
    """
    # .env 파일 로드 (파일이 있는 경우)
    load_dotenv()
    
    # 환경 변수 확인 및 기본값 설정
    required_vars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_BUCKET']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    
    if missing_vars:
        logger.warning(f"다음 필수 환경변수가 설정되지 않았습니다: {', '.join(missing_vars)}")
    
    if not os.environ.get('AWS_REGION'):
        logger.info("AWS_REGION이 설정되지 않아 기본값(ap-northeast-2)을 사용합니다.")
        os.environ['AWS_REGION'] = 'ap-northeast-2'
    
    logger.info("AWS 환경 변수 설정이 완료되었습니다.")

@app.on_event("startup")
async def startup_event():
    global model_service, models_downloaded
    
    # AWS 환경 변수 설정
    setup_aws_env()

    # 모델 다운로드
    background_tasks = BackgroundTasks()
    models_downloaded = await download_all_models(background_tasks)
    
    if models_downloaded:
        # 모델 로드
        if load_model_service():
            logger.info("모델 서비스가 성공적으로 초기화되었습니다.")
        else:
            logger.error("모델 서비스 초기화 실패")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("서비스 종료 중...")

@app.get("/")
async def root():
    global model_service
    try :
        conn = get_db_connection()

    except Exception as e:
        logger.error(f"감정 점수 분석 및 저장 중 오류: {e}", exc_info=True)
    
    return {
        "status": "active", 
        "message": "텍스트 분석 API가 실행 중입니다",
        "version": "1.0.0",
        "models_loaded": model_service is not None
    }

@app.post("/analyze")
async def analyze_articles():
    global model_service
    
    if model_service is None:
        raise HTTPException(status_code=503, detail="모델 서비스가 아직 초기화되지 않았습니다.")
    
    try:

        # S3에서 최근 7일간의 데이터 가져오기
        articles = model_service.fetch_data_from_s3(days=7)
        
        if not articles:
            logger.warning("S3에서 가져온 데이터가 없습니다.")
            return {"average_sentiment_score": 0.0}
        
        total_sentiment_score = 0.0
        economic_articles = 0
        

        # 각 기사 분석
        logger.info(f"총 {len(articles)}개 기사 분석 시작")
        
        for i, article in enumerate(articles[:100]):
            # 진행 상황 로깅 (로그가 너무 많이 출력되지 않도록 일정 간격으로)
            if i % 10 == 0 or i == len(articles) - 1:
                logger.info(f"진행 상황: {i+1}/{len(articles)} 기사 처리 중 ({((i+1)/len(articles)*100):.1f}%)")
            
            text = article.get('content', '')
            
            if not text:
                continue

        # # 각 기사 분석
        # for article in articles:
        #     text = article.get('content', '')
            
        #     if not text:
        #         continue
            
            # 경제 기사 분류
            economic_result = model_service.is_economic_article(text)
            
            # 경제 기사인 경우만 감정 분석 수행
            if economic_result['is_economic']:
                economic_articles += 1
                
                # 감성 분석
                sentiment_result = model_service.analyze_sentiment(text)
                score = sentiment_result['sentiment_score']
                
                # 점수 합산
                total_sentiment_score += score
        
        # 평균 감정 점수 계산
        average_sentiment = total_sentiment_score / economic_articles if economic_articles > 0 else 0.0
        
        # DB에 저장
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO economy_sentiment (sentiment_date, average_sentiment)
        VALUES (CURRENT_DATE, %s)
        ON DUPLICATE KEY UPDATE average_sentiment = %s
        """
        
        cursor.execute(query, (
            round(float(average_sentiment), 4),
            round(float(average_sentiment), 4)
        ))
        
        conn.commit()
        logger.info("DB에 감정 점수 저장 완료")
        
        # 최근 7일간의 평균 감정 점수 조회
        avg_query = """
        SELECT AVG(average_sentiment) as overall_average
        FROM economy_sentiment
        WHERE sentiment_date >= CURRENT_DATE - INTERVAL 7 DAY
        """
        
        cursor.execute(avg_query)
        result = cursor.fetchone()
        
        # 평균 감정 점수 계산
        seven_days_average = round(float(result[0]), 4) if result and result[0] is not None else 0.0
        
        return {
            "average_sentiment_score": seven_days_average
        }
        
    except Exception as e:
        logger.error(f"감정 점수 분석 및 저장 중 오류: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"감정 점수 분석 및 저장 중 오류: {str(e)}")

@app.get("/health")
async def health():
    global model_service, models_downloaded
    health_status = {
        "status": "healthy" if model_service is not None else "initializing",
        "models_downloaded": models_downloaded,
        "service_ready": model_service is not None
    }
    
    if model_service is None:
        return {
            "status": "initializing",
            "message": "서비스가 아직 초기화 중입니다",
            "details": health_status
        }
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=False)