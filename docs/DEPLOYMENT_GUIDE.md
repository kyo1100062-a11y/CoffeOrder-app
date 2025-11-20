# Render.com 배포 가이드

## 배포 순서

1. **PostgreSQL 데이터베이스 생성** (먼저)
2. **백엔드 서버 배포**
3. **프런트엔드 배포**

---

## 1단계: PostgreSQL 데이터베이스 생성

### 1-1. Render 대시보드에서 데이터베이스 생성

1. [Render.com](https://render.com)에 로그인
2. **New +** 버튼 클릭 → **PostgreSQL** 선택
3. 설정:
   - **Name**: `coffee-order-db` (원하는 이름)
   - **Database**: `coffee_order`
   - **User**: 자동 생성됨
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전
   - **Plan**: Free 또는 원하는 플랜

4. **Create Database** 클릭

### 1-2. 데이터베이스 연결 정보 확인

생성 후 **Connections** 탭에서 다음 정보를 복사해두세요:
- **Internal Database URL**: 백엔드에서 사용
- **External Database URL**: 로컬에서 접속 시 사용
- **Host**, **Port**, **Database**, **User**, **Password**

---

## 2단계: 백엔드 서버 배포

### 2-1. GitHub 저장소 준비

1. 프로젝트를 GitHub에 푸시 (아직 안 했다면)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/coffee-order-app.git
   git push -u origin main
   ```

### 2-2. Render에서 Web Service 생성

1. **New +** 버튼 클릭 → **Web Service** 선택
2. **Connect GitHub** → 저장소 선택
3. 설정:
   - **Name**: `coffee-order-api` (원하는 이름)
   - **Region**: 데이터베이스와 같은 지역
   - **Branch**: `main` (또는 배포할 브랜치)
   - **Root Directory**: `server` ⚠️ **중요!**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2-3. 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가:

| Key | Value | 설명 |
|-----|-------|------|
| `PORT` | `10000` | Render는 PORT 환경 변수를 자동으로 제공하지만, 기본값 설정 |
| `NODE_ENV` | `production` | 프로덕션 모드 |
| `DB_HOST` | `[데이터베이스 호스트]` | PostgreSQL 호스트 |
| `DB_PORT` | `5432` | PostgreSQL 포트 |
| `DB_NAME` | `coffee_order` | 데이터베이스 이름 |
| `DB_USER` | `[데이터베이스 사용자]` | PostgreSQL 사용자 |
| `DB_PASSWORD` | `[데이터베이스 비밀번호]` | PostgreSQL 비밀번호 |

**또는 Internal Database URL 사용:**
- `DATABASE_URL`을 사용하면 자동으로 파싱됩니다 (아래 참고)

### 2-4. 데이터베이스 URL 사용 (권장)

Render의 PostgreSQL은 `DATABASE_URL` 환경 변수를 자동으로 제공합니다.

`server/src/config/database.js`를 수정하여 `DATABASE_URL`을 우선 사용하도록 설정:

```javascript
// DATABASE_URL이 있으면 사용, 없으면 개별 환경 변수 사용
const databaseConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Render PostgreSQL은 SSL 필요
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD),
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(databaseConfig);
```

### 2-5. 배포 및 데이터베이스 초기화

1. **Create Web Service** 클릭
2. 배포가 완료되면 **Logs** 탭에서 확인
3. 배포 후 데이터베이스 초기화:
   - Render 대시보드에서 **Shell** 탭 열기
   - 또는 로컬에서 External Database URL로 연결하여 초기화

---

## 3단계: 프런트엔드 배포

### 3-1. Static Site로 배포 (권장)

1. **New +** 버튼 클릭 → **Static Site** 선택
2. **Connect GitHub** → 저장소 선택
3. 설정:
   - **Name**: `coffee-order-app` (원하는 이름)
   - **Branch**: `main`
   - **Root Directory**: `ui` ⚠️ **중요!**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3-2. 환경 변수 설정

**Environment Variables** 섹션에서:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://coffee-order-api.onrender.com` |

⚠️ **주의**: 백엔드 서비스의 실제 URL로 변경하세요!

### 3-3. 배포

1. **Create Static Site** 클릭
2. 배포 완료 후 프런트엔드 URL 확인

---

## 4단계: 데이터베이스 초기화

### 4-1. Render Shell 사용

1. 백엔드 서비스의 **Shell** 탭 열기
2. 다음 명령어 실행:

```bash
cd server
npm run init-db
```

### 4-2. 로컬에서 External Database URL 사용

```bash
# 환경 변수 설정
export DATABASE_URL="postgresql://user:password@host:port/database"

# 또는 .env 파일에 추가
cd server
npm run init-db
```

---

## 5단계: CORS 설정 확인

프런트엔드 URL을 백엔드의 CORS 허용 목록에 추가:

`server/src/index.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://coffee-order-app.onrender.com' // 프런트엔드 URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

또는 프로덕션에서는 모든 origin 허용:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // 프로덕션에서는 모든 origin 허용
    : 'http://localhost:5173'
}));
```

---

## 배포 후 확인 사항

### 백엔드 확인
- ✅ `https://coffee-order-api.onrender.com/` 접속 시 JSON 응답 확인
- ✅ `https://coffee-order-api.onrender.com/api/menus` 접속 시 메뉴 목록 확인

### 프런트엔드 확인
- ✅ 프런트엔드 URL 접속
- ✅ 메뉴 목록이 표시되는지 확인
- ✅ 주문 기능이 작동하는지 확인

### 데이터베이스 확인
- ✅ 백엔드 로그에서 "데이터베이스 연결 성공" 메시지 확인
- ✅ 메뉴 데이터가 있는지 확인

---

## 문제 해결

### 백엔드가 시작되지 않는 경우
1. **Logs** 탭에서 오류 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. `Root Directory`가 `server`로 설정되었는지 확인

### 데이터베이스 연결 실패
1. `DATABASE_URL` 또는 개별 환경 변수 확인
2. SSL 설정 확인 (`ssl: { rejectUnauthorized: false }`)
3. 데이터베이스가 실행 중인지 확인

### 프런트엔드에서 API 호출 실패
1. `VITE_API_BASE_URL` 환경 변수 확인
2. CORS 설정 확인
3. 브라우저 콘솔에서 오류 확인

### 이미지가 표시되지 않는 경우
1. `ui/public/images/` 폴더의 파일이 배포되었는지 확인
2. 이미지 경로가 올바른지 확인

---

## 비용

- **Free 플랜**: 
  - PostgreSQL: 무료 (90일 후 자동 중지, 수동 재시작 필요)
  - Web Service: 무료 (15분 비활성 시 자동 중지)
  - Static Site: 무료

- **Paid 플랜**: 
  - 항상 실행, 더 빠른 성능
  - 월 $7부터 시작

---

## 자동 배포 설정

GitHub에 푸시하면 자동으로 재배포됩니다.

---

## 추가 최적화

1. **환경 변수 관리**: Render의 환경 변수 기능 활용
2. **로깅**: Render의 로그 기능으로 모니터링
3. **백업**: PostgreSQL 자동 백업 설정
4. **도메인 연결**: 커스텀 도메인 설정 가능

