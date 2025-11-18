# 커피 주문 앱 백엔드 서버

Express.js를 사용한 커피 주문 앱의 백엔드 서버입니다.

## 기술 스택

- Node.js
- Express.js
- PostgreSQL

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env` 파일이 이미 생성되어 있습니다. 필요한 설정을 수정합니다.

`.env` 파일에 다음 정보를 설정하세요:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order
DB_USER=postgres
DB_PASSWORD=your_password
```

3. PostgreSQL 데이터베이스 생성:
```bash
# PostgreSQL에 접속하여 데이터베이스 생성
createdb coffee_order
```

또는 psql을 사용:
```bash
psql -U postgres
CREATE DATABASE coffee_order;
```

4. 데이터베이스 스키마 초기화:
```bash
npm run init-db
```

## 실행 방법

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 프로젝트 구조

```
server/
├── src/
│   ├── index.js          # 서버 진입점
│   ├── config/
│   │   └── database.js   # 데이터베이스 연결 설정
│   ├── database/
│   │   ├── schema.sql    # 데이터베이스 스키마
│   │   └── init.js       # 스키마 초기화 스크립트
│   ├── routes/           # API 라우트 (추후 추가)
│   ├── controllers/      # 컨트롤러 (추후 추가)
│   ├── models/           # 데이터 모델 (추후 추가)
│   └── middleware/       # 미들웨어 (추후 추가)
├── .env                  # 환경 변수 설정
├── .gitignore
├── package.json
└── README.md
```

## 데이터베이스 구조

프로젝트는 다음 테이블을 사용합니다:
- `menus`: 메뉴 정보
- `options`: 메뉴 옵션 정보
- `orders`: 주문 정보
- `order_items`: 주문 항목 정보
- `order_item_options`: 주문 항목의 옵션 정보

자세한 스키마는 `src/database/schema.sql` 파일을 참조하세요.

## API 엔드포인트 (예정)

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회

### 주문 관련
- `POST /api/orders` - 주문 생성

### 관리자 관련
- `GET /api/admin/dashboard` - 대시보드 통계 조회
- `GET /api/admin/stock` - 재고 현황 조회
- `PUT /api/admin/stock/:menuId` - 재고 수량 업데이트
- `GET /api/admin/orders` - 주문 목록 조회
- `PUT /api/admin/orders/:orderId/status` - 주문 상태 업데이트
