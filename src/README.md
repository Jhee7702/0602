# 사용자 행동 데이터 수집 과제 - 무신사 날씨 스타일 웹

## 1. 프로젝트 소개  
무신사 날씨 스타일 웹페이지를 기반으로 Google Analytics 4를 연동하여 사용자 행동 데이터를 수집하였습니다.  
기본 페이지 조회 외에도 버튼 클릭, 제품 이미지 클릭, 좋아요 및 공유와 같은 다양한 행동 데이터를 직접 설정하여 수집했습니다.

---

## 2. 수집한 사용자 행동 항목 및 이유  

| 수집 항목 | 이벤트 이름 | 수집 이유 |
|-----------|-------------|------------|
| 전날/내일 콘텐츠 보기 클릭 | click_prevDay, click_nextDay | 사용자 탐색 흐름 분석 |
| 제품 이미지 클릭 | click_productImage | 관심 제품 파악 |
| 좋아요 버튼 클릭 | like_click | 콘텐츠 선호도 분석 |
| 댓글 버튼 클릭 | comment_click | 사용자 참여도 측정 |
| 공유 버튼 클릭 | share_click | 바이럴 가능성 확인 |
| 저장 버튼 클릭 | save_click | 관심 콘텐츠 파악 |

> 참고: 제품 상세 페이지는 무신사 외부 도메인으로 연결되므로, GA4로 행동 데이터 수집이 불가능합니다.

---

## 3. 실제 데이터 수집 확인 스크린샷  

### 📸 Real-time Overview 1  
![실시간 이벤트 개요 1](./public/Real-time_overview1.png)

### 📸 Real-time Overview 2  
![실시간 이벤트 개요 2](./public/Real-time_overview2.png)

---

## 4. 배포된 웹 링크  

👉 [https://your-project-name.netlify.app](https://your-project-name.netlify.app)  
_(Netlify에서 실제 배포 후 생성된 주소로 교체해주세요)_

---

## 5. GitHub 저장소 링크  

👉 [https://github.com/your-username/weather-ga4-project](https://github.com/your-username/weather-ga4-project)