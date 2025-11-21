# 프런트엔드 배포 체크리스트

## 배포 전 확인

### 코드 준비
- [ ] 모든 변경사항이 GitHub에 푸시되었는지 확인
- [ ] `ui/package.json`에 `build` 스크립트가 있는지 확인
- [ ] `ui/src/api/config.js`가 `VITE_API_BASE_URL` 환경 변수를 사용하는지 확인
- [ ] 로컬에서 `npm run build`가 성공하는지 확인

### 빌드 테스트
```bash
cd ui
npm install
npm run build
```
- [ ] 빌드가 성공하는지 확인
- [ ] `dist` 폴더가 생성되는지 확인
- [ ] 빌드된 파일들이 올바른지 확인

---

## Render 배포 설정

### Static Site 생성
- [ ] Render 대시보드에서 **New +** → **Static Site** 선택
- [ ] GitHub 저장소 연결

### 필수 설정
- [ ] **Name**: `coffee-order-app` (또는 원하는 이름)
- [ ] **Branch**: `main` (또는 배포할 브랜치)
- [ ] **Root Directory**: `ui` ⚠️ **중요!**
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Publish Directory**: `dist`

### 환경 변수
- [ ] `VITE_API_BASE_URL` = 백엔드 URL (예: `https://coffee-order-api.onrender.com`)

---

## 배포 후 확인

### 기본 확인
- [ ] 프런트엔드 URL 접속 가능
- [ ] 페이지가 정상적으로 로드됨
- [ ] 콘솔에 오류가 없음

### 기능 확인
- [ ] 메뉴 목록 표시
- [ ] 이미지 로드
- [ ] 장바구니 기능
- [ ] 주문 기능
- [ ] 관리자 페이지

### API 연결 확인
- [ ] 브라우저 개발자 도구 → Network 탭
- [ ] API 호출이 성공하는지 확인
- [ ] CORS 오류가 없는지 확인

---

## 문제 해결

### 빌드 실패
- [ ] Logs 탭에서 오류 확인
- [ ] Root Directory 확인
- [ ] Build Command 확인

### API 연결 실패
- [ ] VITE_API_BASE_URL 확인
- [ ] 백엔드 서비스 상태 확인
- [ ] CORS 설정 확인

### 이미지 표시 안됨
- [ ] public 폴더 파일 확인
- [ ] 이미지 경로 확인

