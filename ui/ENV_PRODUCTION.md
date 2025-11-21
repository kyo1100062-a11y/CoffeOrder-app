# .env.production 파일 가이드

## 파일 위치
`ui/.env.production`

## 파일 내용
```env
# 프로덕션 환경 변수
# 이 파일은 npm run build 실행 시 자동으로 사용됩니다.

# 백엔드 API 기본 URL (Render 배포 주소)
VITE_API_BASE_URL=https://coffeorder-app-backend.onrender.com
```

## Vite 환경 변수 동작 방식

Vite는 빌드 모드에 따라 자동으로 환경 변수 파일을 로드합니다:

- **개발 모드** (`npm run dev`): `.env`, `.env.local`, `.env.development`, `.env.development.local`
- **프로덕션 빌드** (`npm run build`): `.env`, `.env.local`, `.env.production`, `.env.production.local`

### 우선순위
1. `.env.production.local` (가장 높음, Git에 포함 안됨)
2. `.env.production`
3. `.env.local` (Git에 포함 안됨)
4. `.env` (가장 낮음)

## 사용 방법

### 로컬에서 프로덕션 빌드 테스트
```bash
cd ui
npm run build
npm run preview
```

빌드 시 `.env.production` 파일이 자동으로 로드됩니다.

### Render 배포 시

Render에서는 두 가지 방법이 있습니다:

#### 방법 1: .env.production 파일 사용 (권장)
- `.env.production` 파일을 Git에 포함
- Render가 자동으로 빌드 시 사용

#### 방법 2: Render 환경 변수 사용
- Render 대시보드에서 `VITE_API_BASE_URL` 환경 변수 설정
- 환경 변수가 파일보다 우선순위가 높음

## 확인 방법

빌드 후 브라우저 콘솔에서 확인:
```javascript
// 콘솔에 다음 메시지가 표시됩니다:
🔧 환경 모드: production
🔧 API Base URL: https://coffeorder-app-backend.onrender.com
✅ Production API Base URL: https://coffeorder-app-backend.onrender.com
```

## 주의사항

1. **Git 포함 여부**
   - `.env.production`은 일반적으로 Git에 포함해도 됩니다 (공개 정보)
   - 민감한 정보가 있다면 `.env.production.local` 사용

2. **따옴표 사용**
   - Vite에서는 따옴표 없이 사용: `VITE_API_BASE_URL=https://...`
   - 따옴표를 사용해도 작동하지만 권장하지 않음

3. **환경 변수 접두사**
   - Vite는 `VITE_` 접두사가 있는 변수만 클라이언트에 노출
   - `VITE_` 접두사가 없으면 사용할 수 없음

## 문제 해결

### 환경 변수가 적용되지 않는 경우

1. **파일 이름 확인**
   - 정확히 `.env.production`인지 확인
   - `.env.production.txt` 같은 확장자가 없어야 함

2. **빌드 모드 확인**
   - `npm run build`는 자동으로 production 모드
   - `vite build --mode production` 명시적으로 지정 가능

3. **환경 변수 이름 확인**
   - `VITE_` 접두사가 있는지 확인
   - 대소문자 정확히 일치하는지 확인

4. **캐시 문제**
   - `dist` 폴더 삭제 후 재빌드
   - `node_modules/.vite` 캐시 삭제

