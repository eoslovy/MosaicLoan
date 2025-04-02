import pandas as pd
import numpy as np
import pickle
import json
import logging

# 로깅 설정
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(levelname)s: %(message)s')

def load_distribution_info(pkl_file_path):
    """
    분포 정보가 저장된 pkl 파일 로드
    """
    with open(pkl_file_path, 'rb') as f:
        full_distribution_info = pickle.load(f)
        
        # distribution_info 키의 값 반환
        return full_distribution_info['distribution_info']

def impute_with_distribution(df, col_name, distribution_info):
    """
    분포 정보를 바탕으로 결측치 대치
    """
    # 컬럼 데이터 타입 확인
    col_dtype = df[col_name].dtype
    
    # 분포 정보 추출
    type_info = distribution_info.get('type')
    
    # 수치형 데이터 처리 (float, int)
    if type_info == 'numeric':
        mean_val = distribution_info.get('mean')
        stddev_val = distribution_info.get('stddev')
        
        # 결측치 마스크 생성
        null_mask = df[col_name].isna()
        
        # 표준편차가 0이거나 None인 경우 평균값으로 대치
        if stddev_val is None or stddev_val == 0:
            if mean_val is not None:
                df.loc[null_mask, col_name] = mean_val
        else:
            # 정규분포를 따르는 랜덤값 생성
            random_values = np.random.normal(
                loc=mean_val, 
                scale=stddev_val, 
                size=null_mask.sum()
            )
            
            # 결측치에 랜덤값 대입
            df.loc[null_mask, col_name] = random_values
        
        # Integer 타입인 경우 반올림
        if distribution_info.get('is_integer', False):
            df[col_name] = df[col_name].round().astype(int)
    
    # 범주형 데이터 처리
    elif type_info == 'categorical':
        categories = distribution_info.get('categories', [])
        probabilities = distribution_info.get('probabilities', [])
        
        if categories and probabilities:
            # 결측치 마스크 생성
            null_mask = df[col_name].isna()
            
            # 카테고리 분포에 따라 랜덤 대치
            random_categories = np.random.choice(
                categories, 
                size=null_mask.sum(), 
                p=probabilities
            )
            
            # 결측치에 랜덤 카테고리 대입
            df.loc[null_mask, col_name] = random_categories
    
    return df

def impute_dataframe(df, distribution_pkl_path):
    """
    전체 DataFrame의 결측치를 대치하는 주 함수
    """
    # 분포 정보 로드
    distribution_info = load_distribution_info(distribution_pkl_path)
    
    # 각 컬럼별로 결측치 대치
    for col_name in df.columns:
        if col_name in distribution_info:
            df = impute_with_distribution(df, col_name, distribution_info[col_name])
        else:
            logging.warning(f"컬럼 {col_name}에 대한 분포 정보 없음")
    
    return df

def run_imputation(input_json, distribution_pkl_path, output_file_path=None):
    """
    결측치 대치 전체 워크플로우
    """
    try:
        # JSON 문자열을 딕셔너리로 변환
        input_data = json.loads(input_json)
        
        # 딕셔너리를 DataFrame으로 변환
        df = pd.DataFrame([input_data])
        
        # 결측치 대치
        imputed_df = impute_dataframe(df, distribution_pkl_path)
        
        # 결과를 JSON으로 변환
        imputed_json = imputed_df.to_json(orient='records')[1:-1]
        
        return imputed_json
    
    except Exception as e:
        logging.error(f"결측치 대치 중 오류 발생: {e}")
        return None