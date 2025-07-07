# Scraping - 웹 콘텐츠 스크랩 및 아카이빙 서비스

Scraping은 사용자가 웹에서 원하는 콘텐츠(블로그, 뉴스, 유튜브 등)를 스크랩하여 개인화된 공간에 저장하고, 태그를 이용해 손쉽게 관리할 수 있도록 돕는 서비스입니다. 사용자 인증을 통해 자신만의 콘텐츠 아카이브를 만들고, 좋아요나 댓글 같은 소셜 기능을 통해 다른 사용자와 소통할 수 있습니다.

---

## 🚀 주요 기능

- **사용자 인증**:
  - 이메일과 비밀번호를 이용한 회원가입 및 로그인
  - JWT (JSON Web Token) 기반의 안전한 인증 세션 관리

- **콘텐츠 스크랩**:
  - URL만으로 웹 페이지의 메타데이터(제목, 설명, 이미지 등)를 자동으로 추출
  - Naver Blog, YouTube 등 특정 플랫폼에 대한 맞춤 스크래핑 지원
  - 사용자가 직접 글을 작성하고 저장하는 기능

- **아티클 관리**:
  - 스크랩하거나 작성한 아티클을 생성, 조회, 수정, 삭제
  - 저장된 모든 아티클 목록을 확인하고 관리

- **태그 시스템**:
  - 아티클에 여러 태그를 추가하여 콘텐츠를 체계��으로 분류
  - 사용자별로 태그를 생성, 조회, 삭제

- **소셜 기능**:
  - 각 아티클에 '좋아요'를 누르거나 취소하는 기능
  - 아티클에 댓글을 작성, 수정, 삭제하여 의견 공유

---

## 🧱 기술 스택

| 구분 | 기술 |
|---|---|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, SWR |
| **Backend** | Next.js API Routes, Node.js, MongoDB |
| **Database** | MongoDB Atlas, Mongoose |
| **Scraping** | Cheerio, Open Graph Scraper, JSDOM |
| **Authentication** | bcrypt, JSON Web Token (JWT) |
| **Dev Tools** | ESLint, Prettier, TypeScript |

---

## 🏁 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/scraping.git
cd scraping
```

### 2. 종속성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트 디렉터리에 `.env.local` 파일을 생성하고 아래와 같이 환경 변수를 설정합니다.

```env
# MongoDB Connection URI
MONGODB_URI="your_mongodb_connection_string"

# JWT Secret Key
JWT_SECRET="your_jwt_secret_key"

# YouTube API Key (for YouTube scraping)
YOUTUBE_API_KEY="your_youtube_api_key"
```

### 4. 개발 서버 실행

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

---

## 🌐 API 엔드포인트

| Method | Endpoint | 설명 |
|---|---|---|
| **Auth** | | |
| `POST` | `/api/auth/register` | 신규 사용자 회원가입 |
| `POST` | `/api/auth/login` | 사용자 로그인 |
| `GET` | `/api/auth/me` | 현재 로그인된 사용자 정보 조회 |
| **Article** | | |
| `POST` | `/api/post-article` | URL을 스크랩하여 새 아티클 생성 |
| `POST` | `/api/write` | 사용자가 직접 새 아티클 작성 |
| `GET` | `/api/get-article` | 모든 아티클 목록 조회 |
| `PUT` | `/api/modify-article` | 기존 아티클 정보 수정 |
| `DELETE` | `/api/delete-article` | 아티클 삭제 |
| **Metadata** | | |
| `GET` | `/api/get-metadata` | URL에서 메타데이터(제목, 이미지 등) 추출 |
| **Tag** | | |
| `POST` | `/api/post-tag` | 새 태그 생성 |
| `GET` | `/api/get-tag/[userId]` | 특정 사용자의 모든 태그 조회 |
| `DELETE` | `/api/delete-tag` | 태그 삭제 |
| **Like & Comment** | | |
| `GET` | `/api/get-like` | 특정 아티클의 좋아요 및 댓글 목록 조회 |
| `PATCH` | `/api/patch-like` | 아티클에 좋아요 또는 댓글 추가 |
| `PATCH` | `/api/modify-like` | 댓글 내용 수정 |
| `PATCH` | `/api/delete-like` | 아티클의 좋아요 또는 댓글 삭제 |
| **User** | | |
| `GET` | `/api/get-username` | 특�� 사용자 ID로 닉네임 조회 |