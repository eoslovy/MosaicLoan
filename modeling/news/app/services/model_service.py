import os
import re
import torch
import gensim
from gensim import corpora
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from konlpy.tag import Okt
import logging
import numpy as np
import boto3
from datetime import datetime, timedelta


# 로깅 설정
logger = logging.getLogger(__name__)

class EconomicNewsModelService:
    # 경제 뉴스 분석 모델 초기화
    def __init__(self, 
                 base_path='./models',
                 lda_model_name='lda_model*',
                 lda_dict_name='lda_dictionary',
                 bert_model_name='best_klue_bert_economic_sentiment_regression'):
        
        # 디바이스 설정
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # 모델 경로 설정
        self.lda_model_path = os.path.join(base_path, lda_model_name)
        self.lda_dict_path = os.path.join(base_path, lda_dict_name)
        self.bert_model_path = os.path.join(base_path, bert_model_name)
        
        # 모델 및 관련 객체 초기화
        self.lda_model = None
        self.lda_dictionary = None
        self.bert_model = None
        self.tokenizer = None
        self.okt = Okt()
        
        # 경제 관련 키워드
        self.economic_keywords = [
            '경제', '시장', '기업', '투자', '금융', '산업', '무역', '주식', '증권', '수출', 
            '수입', '정책', '성장', '금리', '원화', '펀드', '배당', '실적', '매출', '영업이익',
            '은행', '국내', '미국', '중국', '유럽', '일본', '엔화', '달러', 
            '수요', '공급', '소비', '생산', '인플레이션', '디플레이션', '성장률', 
            '부동산', '환율', '증시', '채권', '예산', '세금', '세제', '세율'
        ]
    
    # 전체 모델 불러오기
    def load_models(self):
        try:
            # LDA 모델 로딩
            self.lda_model = gensim.models.LdaModel.load(f"{self.lda_model_path}.model")
            self.lda_dictionary = corpora.Dictionary.load(f"{self.lda_dict_path}.dict")
            
            # BERT 모델 로딩
            self.tokenizer = AutoTokenizer.from_pretrained("klue/bert-base")
            self.bert_model = AutoModelForSequenceClassification.from_pretrained(
                "klue/bert-base",
                num_labels=1,
                problem_type="regression"
            )
            self.bert_model.load_state_dict(torch.load(
                self.bert_model_path,
                map_location=self.device
            ))
            self.bert_model.to(self.device)
            self.bert_model.eval()
            
            logger.info("모든 모델 로딩 완료")
            return True
        except Exception as e:
            logger.error(f"모델 로딩 중 오류 발생: {e}")
            return False
    
    # 텍스트 전처리
    def preprocess_text(self, text):

        if not isinstance(text, str):
            return ""
        
        # HTML 태그 제거
        text = re.sub(r'<.*?>', '', text)
        
        # 특수문자, 숫자 제거 (경제 용어 중 일부 유지)
        text = re.sub(r'[^\w\s가-힣%$€£¥·]', ' ', text)
        
        # 연속된 공백 제거
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    # 경제 뉴스 판별 
    def is_economic_article(self, text, threshold=0.3):
        try:
            # 전처리
            preprocessed_text = self.preprocess_text(text)
            
            # 명사 추출
            nouns = self.okt.nouns(preprocessed_text)
            
            # 토큰화
            bow = [(self.lda_dictionary.token2id.get(noun), 1.0) for noun in nouns if noun in self.lda_dictionary.token2id]
            
            # 토픽 분포 계산
            if bow:
                topic_dist = self.lda_model.get_document_topics(bow)
                
                economic_topics = self._identify_economic_topics()
                
                # 경제 관련 토픽 확률 합산
                economic_prob = sum(prob for topic_id, prob in topic_dist if topic_id in economic_topics)
                
                return {
                    "is_economic": economic_prob > threshold,
                    "economic_probability": float(economic_prob)
                }
            
            logger.warning("BOW가 비어있어 경제 기사로 판단할 수 없음")
            return {
                "is_economic": False,
                "economic_probability": 0.0
            }
        except Exception as e:
            logger.error(f"경제 기사 판별 중 오류: {e}", exc_info=True)
            return {
                "is_economic": False,
                "economic_probability": 0.0
            }
    
    # 경제 뉴스 추출
    def _identify_economic_topics(self, top_n=5):
        economic_topics = []
        
        for topic_id in range(self.lda_model.num_topics):
            top_keywords = [word for word, _ in self.lda_model.show_topic(topic_id, topn=top_n)]
            
            if any(keyword in top_keywords for keyword in self.economic_keywords):
                economic_topics.append(topic_id)
        
        return economic_topics
    
    # 감정분석
    def analyze_sentiment(self, text):
        try:
            # 전처리
            preprocessed_text = self.preprocess_text(text)
            
            # 토큰화
            encoding = self.tokenizer.encode_plus(
                preprocessed_text,
                add_special_tokens=True,
                max_length=512,
                return_token_type_ids=False,
                padding='max_length',
                truncation=True,
                return_attention_mask=True,
                return_tensors='pt'
            )
            
            # 텐서를 GPU/CPU로 이동
            input_ids = encoding['input_ids'].to(self.device)
            attention_mask = encoding['attention_mask'].to(self.device)
            
            # 예측
            with torch.no_grad():
                outputs = self.bert_model(input_ids=input_ids, attention_mask=attention_mask)
                sentiment_score = outputs.logits.squeeze().cpu().numpy().item()
            
            # 감성 카테고리 결정
            if sentiment_score > 0.2:
                sentiment_category = "positive"
            elif sentiment_score < -0.2:
                sentiment_category = "negative"
            else:
                sentiment_category = "neutral"
            
            return {
                "sentiment_score": float(sentiment_score),
                "sentiment_category": sentiment_category
            }
        except Exception as e:
            logger.error(f"감성 분석 중 오류: {e}")
            return {
                "sentiment_score": 0.0,
                "sentiment_category": "neutral"
            }
        
    # S3 서버에 접근
    def fetch_data_from_s3(self, days=7):
        try:
            # S3 클라이언트 생성 (환경변수나 config에서 가져옴)
            s3_client = boto3.client(
                's3',
                aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
                region_name=os.environ.get('AWS_REGION', 'ap-northeast-2')
            )

            # 날짜 범위 계산
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            logger.info(f"데이터 조회 시작: {start_date} ~ {end_date}")
    
            articles = []
            
            # 버킷 이름 가져오기
            bucket_name = os.environ.get('S3_BUCKET')

            # 각 날짜에 대해 데이터 가져오기
            current_date = start_date
            while current_date <= end_date:
                # 네이버경제뉴스_YYYY.MM.DD.txt 형식의 파일명 생성
                date_str = current_date.strftime('%Y.%m.%d')
                file_key = f'naver_news/네이버경제뉴스_{date_str}.txt'
                
                logger.info(f"S3에서 {file_key} 파일 가져오는 중... (버킷: {bucket_name})")
                
                try:
                    # 파일 가져오기
                    file_response = s3_client.get_object(
                        Bucket=bucket_name,
                        Key=file_key
                    )
                    
                    # 파일 내용 읽기
                    file_content = file_response['Body'].read().decode('utf-8')
                    
                    # 파일 내용을 기사 단위로 분리 (구분선으로 분리)
                    article_chunks = file_content.split('--------------------------------------------------------------------------------')
                    
                    for chunk in article_chunks:
                        if not chunk.strip():
                            continue
                        
                        # 제목, URL, 본문 추출
                        title_match = re.search(r'제목:\s*(.*?)\s*\n', chunk)
                        url_match = re.search(r'URL:\s*(.*?)\s*\n', chunk)
                        content_match = re.search(r'본문:\s*([\s\S]*?)$', chunk)
                        
                        if title_match and content_match:
                            title = title_match.group(1).strip()
                            url = url_match.group(1).strip() if url_match else ''
                            content = content_match.group(1).strip()
                            
                            # 기사 정보 추가
                            article = {
                                'id': url,
                                'title': title,
                                'content': content,
                                'date': date_str
                            }
                            articles.append(article)
                
                except s3_client.exceptions.NoSuchKey:
                    logger.warning(f"{file_key} 파일이 존재하지 않습니다.")
            
                except Exception as e:
                    logger.warning(f"{file_key} 파일 처리 중 오류: {e}")
                
                # 다음 날짜로 이동
                current_date += timedelta(days=1)
            
            logger.info(f"S3에서 총 {len(articles)}개의 기사를 가져왔습니다.")
            
                
            return articles
        
        except Exception as e:
            logger.error(f"S3에서 데이터 가져오기 오류: {e}", exc_info=True)
            return []
    
    # 감정 점수 평균 계산
    def calculate_average_sentiment(self, articles):
        if not articles:
            return {
                "average_score": 0,
                "sentiment_counts": {"positive": 0, "neutral": 0, "negative": 0},
                "total_articles": 0,
                "economic_articles": 0
            }
        
        total_score = 0
        sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
        economic_articles = 0
        
        for article in articles:
            # 기사 내용 가져오기
            text = article.get('content', '')
            
            # 경제 기사 판별
            economic_result = self.is_economic_article(text)
            
            if economic_result['is_economic']:
                economic_articles += 1
                
                # 감정 분석
                sentiment_result = self.analyze_sentiment(text)
                score = sentiment_result['sentiment_score']
                category = sentiment_result['sentiment_category']
                
                # 점수 합산
                total_score += score
                
                # 카테고리 카운트
                sentiment_counts[category] += 1
        
        # 평균 계산
        average_score = total_score / economic_articles if economic_articles > 0 else 0
        
        return {
            "average_score": round(float(average_score), 4),
            "sentiment_counts": sentiment_counts,
            "total_articles": len(articles),
            "economic_articles": economic_articles
        }
    
    # 7일치 감정 분석 실행
    def analyze_articles_from_s3(self, days=7): 
        # S3에서 데이터 가져오기
        articles = self.fetch_data_from_s3(days)
        
        # 기사별 분석 결과
        article_results = []
        
        # 각 기사 분석
        for article in articles:
            article_id = article.get('id', '')
            title = article.get('title', '')
            text = article.get('content', '')
            
            # 경제 기사 분류
            economic_result = self.is_economic_article(text)
            
            # 경제 기사인 경우만 감정 분석 추가
            if economic_result['is_economic']:
                sentiment_result = self.analyze_sentiment(text)
                
                article_results.append({
                    'id': article_id,
                    'title': title,
                    'is_economic': True,
                    'economic_probability': economic_result['economic_probability'],
                    'sentiment_score': sentiment_result['sentiment_score'],
                    'sentiment_category': sentiment_result['sentiment_category']
                })
        
        # 평균 감정 점수 계산
        average_result = self.calculate_average_sentiment(articles)
        
        return {
            "article_results": article_results,
            "summary": {
                "days_analyzed": days,
                "average_sentiment_score": average_result["average_score"],
                "sentiment_distribution": average_result["sentiment_counts"],
                "total_articles": average_result["total_articles"],
                "economic_articles": average_result["economic_articles"]
            }
        }