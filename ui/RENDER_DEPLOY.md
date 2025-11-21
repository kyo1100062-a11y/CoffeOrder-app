# Render.com 프런트엔드 배포 가이드

## 배포 전 확인 사항

### ✅ 코드 준비
- [ ] 모든 코드가 GitHub에 푸시되었는지 확인
- [ ] `ui/package.json`에 빌드 스크립트가 있는지 확인
- [ ] `ui/src/api/config.js`가 환경 변수를 사용하는지 확인

---

## Render.com 배포 과정

### 1단계: GitHub 저장소 준비

프로젝트가 GitHub에 푸시되어 있어야 합니다:

```bash
git add .
git commit -m "Prepare frontend for deployment"
git push origin main
```

### 2단계: Render에서 Static Site 생성

1. [Render.com](https://render.com)에 로그인
2. **New +** 버튼 클릭
3. **Static Site** 선택
4. **Connect GitHub** 클릭
5. 저장소 선택 및 연결

### 3단계: Static Site 설정

다음 설정을 입력합니다:

| 항목 | 값 | 설명 |
|------|-----|------|
| **Name** | `coffee-order-app` | 원하는 서비스 이름 |
| **Branch** | `main` | 배포할 브랜치 |
| **Root Directory** | `ui` | ⚠️ **중요!** 프런트엔드 폴더 |
| **Build Command** | `npm install && npm run build` | 빌드 명령어 |
| **Publish Directory** | `dist` | 빌드 결과물 폴더 |

### 4단계: 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수를 추가:

| Key | Value | 설명 |
|-----|-------|------|
| `VITE_API_BASE_URL` | `https://coffee-order-api.onrender.com` | ⚠️ 실제 백엔드 URL로 변경 |

**중요**: 
- 백엔드 서비스의 실제 URL을 입력하세요
- `http://`가 아닌 `https://`를 사용하세요
- URL 끝에 `/`를 붙이지 마세요

### 5단계: 배포 시작

1. **Create Static Site** 버튼 클릭
2. 배포 진행 상황을 **Logs** 탭에서 확인
3. 배포 완료 후 제공되는 URL 확인

---

## 배포 후 확인

### ✅ 정상 작동 확인

1. **프런트엔드 URL 접속**
   - 예: `https://coffee-order-app.onrender.com`

2. **기능 테스트**
   - [ ] 메뉴 목록이 표시되는지
   - [ ] 이미지가 로드되는지
   - [ ] 장바구니 기능이 작동하는지
   - [ ] 주문 기능이 작동하는지
   - [ ] 관리자 페이지가 작동하는지

3. **브라우저 개발자 도구 확인**
   - F12 → Console 탭: 오류 확인
   - F12 → Network 탭: API 호출 확인

---

## 문제 해결

### 빌드 실패

**증상**: Build Command 실행 중 오류

**해결 방법**:
1. **Logs** 탭에서 오류 메시지 확인
2. `package.json`의 빌드 스크립트 확인
3. `Root Directory`가 `ui`로 설정되었는지 확인
4. `node_modules`가 `.gitignore`에 포함되어 있는지 확인

### API 호출 실패

**증상**: 프런트엔드에서 API를 호출할 수 없음

**해결 방법**:
1. `VITE_API_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인
2. 백엔드 서비스가 실행 중인지 확인
3. 백엔드의 CORS 설정 확인
4. 브라우저 콘솔에서 CORS 오류 확인

### 이미지가 표시되지 않음

**증상**: 메뉴 이미지가 표시되지 않음

**해결 방법**:
1. `ui/public/images/` 폴더의 파일이 배포되었는지 확인
2. 이미지 경로가 올바른지 확인 (`/images/menus/파일명.jpg`)
3. 브라우저 개발자 도구에서 404 오류 확인

### 빈 화면 표시

**증상**: 페이지가 로드되지만 내용이 없음

**해결 방법**:
1. 브라우저 콘솔에서 JavaScript 오류 확인
2. Network 탭에서 API 호출 실패 확인
3. `VITE_API_BASE_URL` 환경 변수 확인

---

## 환경 변수 관리

### 로컬 개발

`ui/.env` 파일 생성 (`.gitignore`에 포함됨):

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 프로덕션 (Render)

Render 대시보드의 **Environment Variables**에서 설정:
- `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

---

## 자동 배포

GitHub에 푸시하면 자동으로 재배포됩니다.

---

## 빌드 최적화 팁

1. **이미지 최적화**: 큰 이미지 파일은 압축
2. **코드 분할**: Vite가 자동으로 처리
3. **캐싱**: Render가 자동으로 처리

---

## 비용

- **Static Site**: 무료
- 제한: 무료 플랜에서도 충분히 사용 가능

---

## 추가 설정 (선택사항)

### 커스텀 도메인

1. Render 대시보드에서 **Settings** → **Custom Domain**
2. 도메인 추가 및 DNS 설정

### 환경별 설정

개발/프로덕션 환경에 따라 다른 API URL 사용:
- 개발: `http://localhost:3001`
- 프로덕션: `https://coffee-order-api.onrender.com`

