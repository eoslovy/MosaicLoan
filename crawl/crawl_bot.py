import boto3
import os
import requests
from bs4 import BeautifulSoup
import time
import random
from newspaper import Article
from datetime import datetime, timedelta
from urllib.parse import unquote
import json
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

# 링크를 저장할 set 생성
news_links = set()

def extract_links_from_naver_page(url, page):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    count = 0
    
    # 첫 페이지는 HTML 형식
    if page == 0:
        soup = BeautifulSoup(response.text, 'html.parser')
        news_list = soup.find('ul', class_='list_news')
        if news_list:
            print("뉴스 목록을 찾았습니다!")
            news_items = news_list.find_all('li', class_='bx')
            print(f"발견된 뉴스 아이템 수: {len(news_items)}")
            
            for news_item in news_items:
                news_link = news_item.find('a', class_='news_tit')
                if news_link and 'href' in news_link.attrs:
                    href = news_link['href']
                    print(f"링크 발견: {href}")
                    news_links.add(href)
                    count += 1
        else:
            print("뉴스 목록을 찾을 수 없습니다!")
            print("현재 페이지 URL:", url)
    
    # 두 번째 페이지부터는 JSON 형식
    else:
        try:
            json_data = json.loads(response.text)
            if 'collection' in json_data and len(json_data['collection']) > 0:
                html_content = json_data['collection'][0]['html']
                soup = BeautifulSoup(html_content, 'html.parser')
                
                news_items = soup.find_all('li', class_='bx')
                print(f"JSON에서 발견된 뉴스 아이템 수: {len(news_items)}")
                
                for news_item in news_items:
                    news_link = news_item.find('a', class_='news_tit')
                    if news_link and 'href' in news_link.attrs:
                        href = news_link['href']
                        print(f"링크 발견: {href}")
                        news_links.add(href)
                        count += 1

                         # ✅ 테스트 목적: 100개 초과 시 종료
                        if len(news_links) >= 100:
                            print("✅ 테스트 한도인 100개 뉴스 링크 수집 완료")
                            return count
            else:
                print("JSON에서 뉴스 데이터를 찾을 수 없습니다!")
        except json.JSONDecodeError:
            print("JSON 파싱 오류! 응답이 JSON 형식이 아닙니다.")
            print("응답 내용:", response.text[:200])  # 처음 200자만 출력
    
    return count

def process_article(url):
    try:
        article = Article(url, language='ko')
        article.download()
        article.parse()
        
        if article.title and article.text:
            return {
                'url': url,
                'title': article.title,
                'text': article.text,
                'success': True
            }
    except Exception as e:
        print(f"오류 발생: {url} - {str(e)}")
        return {
            'url': url,
            'success': False
        }

def crawl_single_day_naver(date_str):
    total_start_time = time.time()  # 전체 시작 시간
    crawl_start_time = time.time()  # 링크 수집 시작 시간
    news_links.clear()
    
    first_page_url = f"https://search.naver.com/search.naver?where=news&query=%EA%B2%BD%EC%A0%9C&sm=tab_opt&sort=2&photo=0&field=0&pd=3&ds={date_str}&de={date_str}&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Ar%2Cp%3Afrom{date_str.replace('.', '')}to{date_str.replace('.', '')}&is_sug_officeid=0&office_category=0&service_area=0"
    base_url = f"https://s.search.naver.com/p/newssearch/2/search.naver?where=news_tab_api&query=%EA%B2%BD%EC%A0%9C&pd=3&ds={date_str}&de={date_str}&nso=so:r,p:from{date_str.replace('.', '')}to{date_str.replace('.', '')},a:all&sort=2"
    
    print(f"\n{date_str} 날짜의 뉴스 링크 수집 중...")
    page = 0
    previous_total = 0
    no_new_links_count = 0  # 새로운 링크가 없는 횟수를 카운트
    
    try:
        # 첫 페이지 크롤링
        items_found = extract_links_from_naver_page(first_page_url, page)
        current_total = len(news_links)
        print(f"페이지 {page+1}: {items_found}개 항목 발견, 현재까지 총 {current_total}개 링크 수집")
        
        if items_found > 0:  # 첫 페이지에서 결과가 있으면 계속 진행
            page = 1  # 두 번째 페이지부터 시작
            
            while True:
                start_param = page * 10 + 1  # 11, 21, 31, ...
                page_url = f"{base_url}&start={start_param}"
                
                items_found = extract_links_from_naver_page(page_url, page)
                current_total = len(news_links)
                print(f"페이지 {page+1}: {items_found}개 항목 발견, 현재까지 총 {current_total}개 링크 수집")
                
                if current_total == previous_total:  # 새로운 링크가 없는 경우
                    no_new_links_count += 1
                    print(f"연속 {no_new_links_count}번 새로운 링크가 없습니다.")
                    if no_new_links_count >= 5:  # 5번 연속으로 새로운 링크가 없으면
                        print(f"5번 연속으로 새로운 링크가 없어 다음 날짜로 넘어갑니다.")
                        break
                else:
                    no_new_links_count = 0  # 새로운 링크가 있으면 카운트 리셋
                
                previous_total = current_total
                page += 1

                # ✅ 여기!
                if len(news_links) >= 100:
                    print("✅ 테스트 한도인 100개 뉴스 링크 수집 완료 (루프 종료)")
                    break
                time.sleep(random.uniform(1.0, 3.0))
                
    except Exception as e:
        print(f"\n{date_str} 크롤링 중 오류 발생: {str(e)}")
        print(f"다음 날짜로 넘어갑니다.")

    crawl_end_time = time.time()  # 링크 수집 종료 시간
    crawl_duration = crawl_end_time - crawl_start_time
    parse_duration = 0  # 기본값 설정
    success_count = 0

    if len(news_links) > 0:
        print(f"\n{date_str}: 총 {len(news_links)}개의 뉴스 링크를 수집했습니다.")
        filename = f"네이버경제뉴스_{date_str}.txt"
        print(f"\n{date_str} 기사 내용 추출 중...")
        
        parse_start_time = time.time()
        
        # 최대 10개의 스레드로 병렬 처리
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_url = {executor.submit(process_article, url): url for url in news_links}
            
            with open(filename, "w", encoding="utf-8") as f:
                for future in concurrent.futures.as_completed(future_to_url):
                    result = future.result()
                    if result and result.get('success'):
                        f.write(f"제목: {result['title']}\n\n")
                        f.write(f"URL: {result['url']}\n\n")
                        f.write(f"본문:\n{result['text']}\n\n")
                        f.write("-" * 80 + "\n\n")
                        success_count += 1
        
        parse_duration = time.time() - parse_start_time
        print(f"결과는 '{filename}' 파일에 저장되었습니다.")

        s3.upload_file(
            Filename=filename,
            Bucket=os.getenv("S3_BUCKET"),
            Key=f"naver_news/{filename}"
        )
        print(f"S3 업로드 완료: naver_news/{filename}")

    total_duration = time.time() - total_start_time
    print(f"\n{date_str} 처리 시간 분석:")
    print(f"1. 링크 수집 시간: {crawl_duration:.2f}초 ({crawl_duration/60:.2f}분)")
    print(f"2. 본문 수집 시간: {parse_duration:.2f}초 ({parse_duration/60:.2f}분)")
    print(f"3. 전체 처리 시간: {total_duration:.2f}초 ({total_duration/60:.2f}분)")
    
    return success_count

yesterday = datetime.now() - timedelta(days=1)
date_str = yesterday.strftime("%Y.%m.%d")

print(f"\n어제 날짜 기준 크롤링 시작: {date_str}")
total_articles = crawl_single_day_naver(date_str)

print(f"\n전체 크롤링 완료! 총 {total_articles}개의 기사를 추출했습니다.")
