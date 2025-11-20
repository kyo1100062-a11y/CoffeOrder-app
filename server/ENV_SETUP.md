# .env 파일 설정 가이드

## 빠른 시작

1. `server/env.example` 파일을 복사하여 `server/.env` 파일을 생성합니다:
   ```bash
   cd server
   cp env.example .env
   ```

2. `server/.env` 파일을 열고 실제 PostgreSQL 정보로 수정합니다.

3. 환경 변수 검증:
   ```bash
   npm run validate-env
   ```

## 필수 환경 변수

다음 환경 변수들이 모두 설정되어 있어야 합니다:

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `PORT` | 서버 포트 | `3001` |
| `DB_HOST` | PostgreSQL 서버 주소 | `localhost` |
| `DB_PORT` | PostgreSQL 포트 | `5432` |
| `DB_NAME` | 데이터베이스 이름 | `coffee_order` |
| `DB_USER` | PostgreSQL 사용자 | `postgres` |
| `DB_PASSWORD` | PostgreSQL 비밀번호 | `your_actual_password` |

## .env 파일 예시

```env
# 서버 포트 설정
PORT=3001

# PostgreSQL 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order
DB_USER=postgres
DB_PASSWORD=avaddfa1111!
```

## 중요 사항

### 1. 비밀번호 설정
- **반드시 실제 PostgreSQL 비밀번호로 변경해야 합니다**
- `your_password`나 `your_postgresql_password_here`는 템플릿 값입니다
- 비밀번호에 특수문자(`!`, `@`, `#`, `$` 등)가 있어도 그대로 입력하면 됩니다
- **따옴표를 사용하지 마세요** (예: `DB_PASSWORD="password"` ❌)

### 2. 값 형식
```env
# ✅ 올바른 형식
DB_PASSWORD=avaddfa1111!
PORT=3001

# ❌ 잘못된 형식
DB_PASSWORD="avaddfa1111!"  # 따옴표 사용 금지
PORT=3001 # 주석  # 값 뒤에 주석 불가
```

### 3. 공백 주의
- 값 앞뒤에 공백이 없어야 합니다
- 비밀번호에 공백이 있으면 제거하거나 다른 문자로 대체하세요

### 4. 파일 인코딩
- 파일은 **UTF-8** 인코딩으로 저장되어야 합니다
- Windows 메모장에서 저장할 때 "인코딩: UTF-8"을 선택하세요

## 문제 해결

### "client password must be a string" 오류
이 오류는 `DB_PASSWORD`가 설정되지 않았거나 빈 값일 때 발생합니다.

**해결 방법:**
1. `server/.env` 파일을 엽니다
2. `DB_PASSWORD=실제_비밀번호`로 설정합니다
3. 템플릿 값(`your_password` 등)이 아닌 실제 비밀번호인지 확인합니다
4. 서버를 재시작합니다

### 환경 변수 검증
```bash
npm run validate-env
```

이 명령어는 모든 환경 변수가 올바르게 설정되었는지 확인합니다.

### 데이터베이스 연결 테스트
서버를 실행하면 자동으로 데이터베이스 연결을 테스트합니다:
- ✅ 성공: "데이터베이스 연결 성공: [타임스탬프]"
- ❌ 실패: "데이터베이스 연결 실패: [오류 메시지]"

## 데이터베이스 초기화

환경 변수를 설정한 후 데이터베이스를 초기화합니다:

```bash
npm run init-db
```

이 명령어는:
1. 데이터베이스 스키마를 생성합니다
2. 초기 메뉴 및 옵션 데이터를 삽입합니다

## 체크리스트

- [ ] `server/.env` 파일이 존재합니다
- [ ] 모든 필수 환경 변수가 설정되었습니다
- [ ] `DB_PASSWORD`가 실제 PostgreSQL 비밀번호로 설정되었습니다
- [ ] `npm run validate-env` 명령어가 성공합니다
- [ ] 서버 실행 시 데이터베이스 연결이 성공합니다

