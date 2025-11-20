# Render.com 배포 체크리스트

## 배포 전 확인 사항

### ✅ 코드 준비
- [ ] 모든 코드가 GitHub에 푸시되었는지 확인
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `node_modules`가 `.gitignore`에 포함되어 있는지 확인

### ✅ 백엔드 준비
- [ ] `server/package.json`에 `engines.node` 설정 확인
- [ ] `server/src/config/database.js`가 `DATABASE_URL`을 지원하는지 확인
- [ ] CORS 설정이 프로덕션 환경을 고려하는지 확인

### ✅ 프런트엔드 준비
- [ ] `ui/src/api/config.js`가 환경 변수를 사용하는지 확인
- [ ] 빌드 명령어가 올바른지 확인 (`npm run build`)

---

## 배포 순서

### 1단계: PostgreSQL 데이터베이스 생성
- [ ] Render 대시보드에서 PostgreSQL 생성
- [ ] 데이터베이스 이름: `coffee_order`
- [ ] 연결 정보 복사 및 저장

### 2단계: 백엔드 서버 배포
- [ ] Web Service 생성
- [ ] Root Directory: `server` 설정
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] 환경 변수 설정:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (자동 또는 수동)
  - [ ] 또는 개별 DB 변수들
- [ ] 배포 완료 확인
- [ ] 로그에서 "데이터베이스 연결 성공" 확인

### 3단계: 데이터베이스 초기화
- [ ] Render Shell에서 `npm run init-db` 실행
- [ ] 또는 로컬에서 External Database URL로 초기화

### 4단계: 프런트엔드 배포
- [ ] Static Site 생성
- [ ] Root Directory: `ui` 설정
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] 환경 변수 설정:
  - [ ] `VITE_API_BASE_URL` = 백엔드 URL
- [ ] 배포 완료 확인

### 5단계: 최종 확인
- [ ] 백엔드 URL 접속 테스트
- [ ] 프런트엔드 URL 접속 테스트
- [ ] 메뉴 목록 표시 확인
- [ ] 주문 기능 테스트
- [ ] 관리자 페이지 테스트

---

## 배포 후 문제 해결

### 백엔드가 시작되지 않는 경우
1. Logs 탭에서 오류 확인
2. 환경 변수 확인
3. Root Directory 확인

### 데이터베이스 연결 실패
1. DATABASE_URL 또는 개별 변수 확인
2. SSL 설정 확인
3. 데이터베이스가 실행 중인지 확인

### 프런트엔드에서 API 호출 실패
1. VITE_API_BASE_URL 확인
2. CORS 설정 확인
3. 브라우저 콘솔 확인

---

## 유용한 명령어

### 로컬에서 External Database URL로 초기화
```bash
export DATABASE_URL="postgresql://user:password@host:port/database"
cd server
npm run init-db
```

### Render Shell에서 데이터베이스 초기화
```bash
cd server
npm run init-db
```

