# 🙏 Pilgrim House Bible School — 선교 사이트

캄보디아 시한욱빌 김순아 선교사님의 선교 소식을 전하는 사이트입니다.

---

## 기술 스택

- **Next.js 14** (App Router + Static Export)
- **Tailwind CSS**
- **Notion API** — 콘텐츠 관리
- **GitHub Pages** — 무료 호스팅
- **GitHub Actions** — 자동 빌드 & 배포

---

## 로컬 개발 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env.local
```

`.env.local`을 열고 아래 값을 채워넣으세요.

```
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_PRAYER_DB_ID=xxxxxxxxxxxxxxxxxx
NOTION_GALLERY_DB_ID=xxxxxxxxxxxxxxxxxx
NOTION_NEWS_DB_ID=xxxxxxxxxxxxxxxxxx
```

### 3. 개발 서버 실행
```bash
npm run dev
```

→ http://localhost:3000 에서 확인

---

## Notion 설정 방법

### Integration 생성
1. https://www.notion.so/my-integrations 접속
2. "New integration" 클릭
3. 이름 입력 (예: `pilgrim-house-site`)
4. 발급된 **Internal Integration Token** → `.env.local`의 `NOTION_TOKEN`에 입력

### 데이터베이스 생성 및 연결
각 DB 생성 후:
1. DB 우상단 `···` → "Add connections" → 위에서 만든 Integration 선택
2. DB URL에서 ID 복사: `notion.so/xxxxxxxxxx?v=...` → `xxxxxxxxxx` 부분

필요한 DB 3개:
- **기도제목** (Prayer Requests)
- **갤러리** (Gallery)
- **선교소식** (Mission News)

DB 속성 설계는 `docs/PLANNING.md` 참고

---

## 배포 설정

### GitHub Secrets 등록
레포 → Settings → Secrets and variables → Actions → New repository secret

| Key | Value |
|-----|-------|
| `NOTION_TOKEN` | Notion Integration Token |
| `NOTION_PRAYER_DB_ID` | 기도제목 DB ID |
| `NOTION_GALLERY_DB_ID` | 갤러리 DB ID |
| `NOTION_NEWS_DB_ID` | 선교소식 DB ID |

### GitHub Pages 활성화
레포 → Settings → Pages → Source: **GitHub Actions**

### 커스텀 도메인 연결
1. `public/CNAME` 파일에 도메인 입력 (예: `pilgrim.yourdomain.com`)
2. 도메인 업체 DNS에 아래 레코드 추가:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
CNAME www  your-github-username.github.io
```

3. 레포 → Settings → Pages → Custom domain 입력 → Save

---

## 자동 배포

- `main` 브랜치에 push 시 즉시 빌드 & 배포
- **매일 오전 6시 (KST)** 자동 재빌드 → Notion 새 글 자동 반영

수동 배포: GitHub → Actions 탭 → "Deploy to GitHub Pages" → "Run workflow"

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 공통 레이아웃
│   ├── page.tsx            # 홈
│   ├── prayer/page.tsx     # 기도제목
│   ├── gallery/page.tsx    # 갤러리
│   ├── news/
│   │   ├── page.tsx        # 소식 목록
│   │   └── [slug]/page.tsx # 소식 상세
│   └── support/page.tsx    # 후원 안내
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
└── lib/
    ├── notion.ts           # Notion API
    └── types.ts            # 타입 정의
```
