import pandas as pd
import pickle
import os
import argparse

def extract_distribution_info(parquet_path: str, output_path: str):
    print(f"Parquet 파일 로드 중: {parquet_path}")
    
    # Parquet 파일 로드
    df = pd.read_parquet(parquet_path)
    print(f"로드된 데이터: {len(df)} 행, {len(df.columns)} 열")
    
    # 분포 정보를 저장할 딕셔너리
    distribution_info = {}
    column_dtypes = {}
    
    # 각 컬럼에 대해 분포 정보 계산
    for col_name in df.columns:
        # 컬럼 데이터 타입 저장
        column_dtypes[col_name] = str(df[col_name].dtype)
        
        # 컬럼 데이터 타입에 따라 처리
        if pd.api.types.is_numeric_dtype(df[col_name]):
            # 수치형 데이터 처리
            mean_val = df[col_name].mean()
            stddev_val = df[col_name].std()
            
            # 분포 정보 저장
            distribution_info[col_name] = {
                'type': 'numeric',
                'mean': mean_val,
                'stddev': stddev_val
            }
        else:
            # 범주형 데이터 처리
            value_counts = df[col_name].value_counts(normalize=True)
            
            if not value_counts.empty:
                categories = value_counts.index.tolist()
                probabilities = value_counts.values.tolist()
                
                # 분포 정보 저장
                distribution_info[col_name] = {
                    'type': 'categorical',
                    'categories': categories,
                    'probabilities': probabilities
                }
    
    # 분포 정보 저장
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'wb') as f:
        pickle.dump({
            'distribution_info': distribution_info,
            'column_dtypes': column_dtypes,
            'input_cols': list(df.columns)
        }, f)
    
    print(f"분포 정보가 '{output_path}'에 저장되었습니다.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Parquet 파일에서 분포 정보 추출')
    parser.add_argument('--input', required=True, help='Parquet 파일 경로')
    parser.add_argument('--output', default='distribution_info.pkl', help='출력 파일 경로')
    
    args = parser.parse_args()
    
    extract_distribution_info(
        parquet_path=args.input,
        output_path=args.output,
    )