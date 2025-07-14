 ## 화면 구성

| ![시작화면](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/start-Cclt86Q9C4hJW6ChdGBxdKnhS4Hfx6.png) | ![로그인](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/login-tv0UxJVmHwE0816zWPQT8nmpqOMq3A.gif) | ![프로필](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/Profile-2muPIsQzgrxiizQTaFBoAbQipkKiJn.png) |
|:--:|:--:|:--:|
| 시작화면 | 로그인 | 프로필 |

| ![손글씨 기록](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/freecompress-%EC%86%90%EA%B8%80%EC%94%A8%EA%B8%B0%EB%A1%9D-qCKJZ0864WjOfwUZyktpTVasa2eG5y.gif) | ![온라인 기록](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/%EC%98%A8%EB%9D%BC%EC%9D%B8%EA%B8%B0%EB%A1%9D-tSVNvRWcF2nPkORvk1J6JUTM2d2i0x.gif) | ![홈 화면](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/%ED%99%88%ED%99%94%EB%A9%B4-NheJDnOnDkZcyFfp8obfSo08YBDhYJ.gif) |
|:--:|:--:|:--:|
| 손글씨 기록 | 온라인 기록 | 홈 화면 |

| ![피드 화면_PC버전](https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/PC_%ED%94%BC%EB%93%9C-MJFvpyMdmjp9PaglgSX64AShm4lNBm.gif) |  |  |
|:--:|:--:|:--:|
| 피드 화면_PC버전 |  |  |


## 📚 Scraping!
## 온라인 기록 플랫폼

### 🔍 프로젝트 개요

> “온라인에서 만나는, 거인의 어깨 위 기록들”
> 

**Scraping**은 사용자가 온라인과 오프라인에서 접한 글, 정보, 생각들을 손쉽게 기록하고, 정리하고, 공유할 수 있는 **디지털 기록 플랫폼**입니다. 빠른 화면 전환, 간결한 UX, 다양한 스크랩 수단을 통해 사용자의 기록 경험을 혁신합니다.

---

### 🎯 대상 사용자

- 온라인 글을 읽고 기록하고 싶은 모든 사용자
- 지식을 정리하고 공유하며 성장하고자 하는 독서가, 작가, 연구자 등

---

### 🛠 주요 기능

### 1. **회원 시스템**

- **OAuth 로그인** 지원 ([예정] Kakao)
- 나만의 **온라인 책장** 생성
- 다른 사용자의 기록 열람 및 공유 기능

### 2. **온라인 글 스크래핑**

- **링크 기반** 저장으로 간편한 기록
- 저장 시 메모, 기분, 상황 등을 함께 입력 가능
- 태그 기반 분류 기능

### 3. 손글씨 **기록 기능**

- **독서노트, 일기** 등 직접 생성한 기록들을 저장 가능

---

### 🚀 문제 해결 방식

| 문제 | 해결 방안 |
| --- | --- |
| 복잡한 UX와 느린 화면 전환 | **빠른 전환**과 **간결한 UI/UX**로 해결 |
| - | **온라인 통합 기록장** 구축 |
| 지식의 단절 | **커뮤니티와 공유 기능**으로 집단 지성 구현 |

---

### 🔧 개발 단계 및 기능별 릴리즈

### ✅ **MVP 1**

- [x]  온라인 글 스크래핑 기능
- [x]  태그별 기록 분류 및 보기
- [x]  로그인/회원가입 기능 (OAuth)

### ✅ **MVP 2** (v0.1.0~)

- [x]  모바일 화면 최적화 (Responsive UI)
- [x]  커뮤니티 기능 (기록 공유 및 탐색)

### 🔄 **MVP 3** *(개발 예정)*

- [ ]  **크롬 익스텐션**으로 웹페이지 스크랩 기능
- [ ]  **카카오 로그인** 연동
- [x]  **마크다운 기반** 기록 작성 기능

---

## 🧱 기술 스택

| **구분** | **기술 스택** |
| --- | --- |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, SWR |
| **Backend** | Next.js API Routes, Node.js, MongoDB |
| **Database** | MongoDB Atlas, Mongoose |
| **Scraping** | Cheerio, Open Graph Scraper, JSDOM |
| **Authentication** | bcrypt, JSON Web Token (JWT) |
| **Dev Tools** | ESLint, Prettier, TypeScript |