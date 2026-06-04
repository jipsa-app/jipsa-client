# 🏠 집사 클라이언트 (Jipsa Client)

> 처음 집 구하는 사회초년생·신혼부부를 위한 부동산 거래 가이드 서비스 **집사**의 프론트엔드입니다.

## 📌 관련 레포지토리
- 백엔드: [jipsa-server](https://github.com/jipsa-app/jipsa-server)

---

## 🛠 기술 스택

| 분류 | 기술 |
|---|---|
| Language | JavaScript |
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| 인증 | JWT (localStorage) |

---

## 🗂 프로젝트 구조

```
src
├── api/           # axios API 호출 모듈
├── components/    # 공통 컴포넌트 (Header, Spinner, Toast 등)
└── pages/         # 페이지 컴포넌트
    ├── Home.jsx
    ├── MonthlyGuide.jsx  # 월세 계약 가이드
    ├── JeonseGuide.jsx   # 전세 계약 가이드
    ├── SaleGuide.jsx     # 매매 계약 가이드
    ├── Checklist.jsx     # 전세사기 예방 체크리스트
    ├── Documents.jsx     # 서류 미리보기
    ├── Schedule.jsx      # 계약 일정 관리
    ├── Login.jsx
    ├── Signup.jsx
    └── NotFound.jsx
```

---

## ✨ 주요 기능

- **거래 유형별 단계 가이드** — 월세/전세/매매 STEP별 안내 및 체크리스트
- **로그인 게이트** — 3단계 이상은 로그인 필요 (회원 유도)
- **체크리스트 DB 저장** — 로그인 시 진행상태 자동 저장 및 복원
- **계약 일정 관리** — D-day 자동 계산, 홈 화면 임박 일정 배너
- **서류 미리보기** — 등기부등본·계약서·건축물대장 보는 법 안내
- **JWT 인증** — 로그인/회원가입, axios interceptor로 토큰 자동 주입

---

## 🚀 로컬 실행 방법

```bash
# 1. 레포지토리 클론
git clone https://github.com/jipsa-app/jipsa-client.git

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

> 백엔드 서버(jipsa-server)가 함께 실행되어 있어야 합니다.

---

## 🔗 배포

- Frontend: Vercel
- 배포 URL: https://jipsa-client.vercel.app
