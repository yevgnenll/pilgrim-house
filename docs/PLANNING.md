# 필그림 하우스 선교 사이트 — 플래닝 문서

> 캄보디아 시한욱빌 김순아 선교사님의 사역을 소개하고,
> 기도제목 · 사진 · 소식을 나누는 정적 사이트

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 사이트명 | Pilgrim House Bible School |
| 목적 | 선교 소식 공유 / 기도제목 전달 / 후원 안내 |
| 관리자 | Josh (개발) + 선교사님 (Notion 콘텐츠 작성) |
| 호스팅 | GitHub Pages (무료) |
| 도메인 | 보유 중인 커스텀 도메인 연결 |

---

## 2. 기술 스택

| 역할 | 도구 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router, Static Export) | Notion API 연동 쉬움, GitHub Pages 지원 |
| 스타일링 | Tailwind CSS | 빠른 개발, 반응형 처리 편함 |
| 콘텐츠 DB | Notion | 선교사님이 직접 글/사진 작성 가능 |
| 배포 | GitHub Pages | 무료, 안정적 |
| 자동화 | GitHub Actions | push 시 빌드 + 매일 새벽 자동 재빌드 |
| 이미지 최적화 | next/image + unoptimized 모드 | 정적 export 호환 |

---

## 3. 사이트 구조

```
/                   홈 — 소개 + 최근 소식 미리보기
/prayer             기도제목 목록
/gallery            사진 갤러리
/news               선교 소식 블로그
/news/[slug]        개별 소식 상세 페이지
/support            후원 안내 (정적)
```

---

## 4. Notion 데이터베이스 설계

### 4-1. 기도제목 DB (Prayer Requests)
| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 기도제목 요약 |
| Content | Rich Text | 상세 내용 |
| Date | Date | 작성일 |
| Status | Select | 기도중 / 응답됨 |
| Published | Checkbox | 공개 여부 |

### 4-2. 갤러리 DB (Gallery)
| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 사진 제목 |
| Photo | Files | 이미지 첨부 |
| Description | Rich Text | 설명 |
| Date | Date | 촬영일 |
| Tag | Multi-select | 예배 / 학교 / 사역 / 일상 |
| Published | Checkbox | 공개 여부 |

### 4-3. 선교소식 DB (Mission News)
| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 소식 제목 |
| Slug | Rich Text | URL용 영문 식별자 (예: april-2025-update) |
| Cover | Files | 커버 이미지 |
| Summary | Rich Text | 목록에서 보이는 미리보기 문장 |
| Date | Date | 작성일 |
| Published | Checkbox | 공개 여부 |
| (본문) | Page content | Notion 페이지 본문으로 작성 |

---

## 5. Notion API 연동 구조

```
lib/
  notion.ts         Notion Client 초기화 + 공통 fetch 함수
  types.ts          TypeScript 타입 정의

데이터 흐름:
  Notion DB → notion.ts → page의 generateStaticParams / fetch → 컴포넌트 렌더링
```

### 환경변수 (.env.local)
```
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_PRAYER_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_GALLERY_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_NEWS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 6. GitHub Actions 워크플로우

### 트리거 2가지
1. **main 브랜치 push** → 즉시 빌드 및 배포
2. **매일 새벽 6시 (KST)** → 자동 재빌드 (선교사님이 Notion에 글 쓰면 반영)

---

## 7. DNS 연결 방법

GitHub Pages 기본 주소: `username.github.io/repo-name`

### 커스텀 도메인 연결 (도메인 업체 DNS 설정)
```
A 레코드  @  →  185.199.108.153
A 레코드  @  →  185.199.109.153
A 레코드  @  →  185.199.110.153
A 레코드  @  →  185.199.111.153
CNAME    www  →  username.github.io
```

GitHub 레포 → Settings → Pages → Custom domain 입력
→ HTTPS 자동 발급 (Let's Encrypt)

---

## 8. 개발 순서 (체크리스트)

### Phase 1 — 인프라 세팅
- [ ] GitHub 레포 생성 + main 브랜치 보호 설정
- [ ] Next.js 프로젝트 초기화 (`npx create-next-app`)
- [ ] Tailwind CSS 설정
- [ ] GitHub Actions 워크플로우 작성
- [ ] GitHub Pages 활성화 (gh-pages 브랜치)
- [ ] 커스텀 도메인 DNS 연결

### Phase 2 — Notion 연동
- [ ] Notion Integration 생성 (API Key 발급)
- [ ] DB 3개 생성 + Integration 연결
- [ ] `lib/notion.ts` 작성
- [ ] `.env.local` 설정 + GitHub Secrets 등록

### Phase 3 — 페이지 구현
- [ ] 레이아웃 / 네비게이션 컴포넌트
- [ ] 홈 페이지
- [ ] 기도제목 페이지
- [ ] 갤러리 페이지
- [ ] 선교 소식 목록 + 상세 페이지
- [ ] 후원 안내 페이지

### Phase 4 — 마무리
- [ ] 반응형 디자인 점검 (모바일)
- [ ] 한국어 메타태그 / OG 이미지 설정
- [ ] 자동 재빌드 스케줄 테스트
- [ ] 선교사님 Notion 사용법 가이드 작성

---

## 9. 폴더 구조

```
pilgrim-house-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 배포 자동화
├── public/
│   ├── CNAME                   # 커스텀 도메인 설정
│   └── images/                 # 정적 이미지 (로고 등)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈
│   │   ├── prayer/
│   │   │   └── page.tsx        # 기도제목
│   │   ├── gallery/
│   │   │   └── page.tsx        # 갤러리
│   │   ├── news/
│   │   │   ├── page.tsx        # 소식 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 소식 상세
│   │   └── support/
│   │       └── page.tsx        # 후원 안내
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── PrayerCard.tsx
│   │       ├── GalleryGrid.tsx
│   │       └── NewsCard.tsx
│   └── lib/
│       ├── notion.ts           # Notion API 함수
│       └── types.ts            # 타입 정의
├── .env.local                  # 환경변수 (gitignore)
├── .env.example                # 환경변수 예시 (git에 포함)
├── next.config.js              # Static export 설정
└── tailwind.config.js
```

---

## 10. 참고 링크

- Notion API 문서: https://developers.notion.com
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- GitHub Pages 커스텀 도메인: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
