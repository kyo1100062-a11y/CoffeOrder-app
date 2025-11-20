# 커피 이미지 변경 가이드

## 현재 이미지 구조

- **저장 위치**: PostgreSQL 데이터베이스 `menus` 테이블의 `imageUrl` 컬럼
- **표시 위치**: `ui/src/components/MenuCard.jsx`에서 `menu.imageUrl` 사용
- **현재 방식**: Unsplash 외부 URL 사용
- **로컬 이미지**: `ui/public/images/menus/` 폴더에 일부 이미지 존재

---

## 방법 1: 데이터베이스에서 직접 수정 (가장 간단)

### 1-1. SQL로 직접 업데이트

PostgreSQL에 접속하여 직접 SQL로 수정:

```sql
-- 특정 메뉴의 이미지 URL 변경
UPDATE menus 
SET "imageUrl" = '새로운_이미지_URL' 
WHERE name = '아메리카노(ICE)';

-- 예시: 로컬 이미지 사용
UPDATE menus 
SET "imageUrl" = '/images/menus/IceAme.jpg' 
WHERE name = '아메리카노(ICE)';
```

### 1-2. Node.js 스크립트로 업데이트

`server/src/utils/updateImages.js` 파일 생성:

```javascript
import pool from '../config/database.js';

const updateImages = async () => {
  const updates = [
    {
      name: '아메리카노(ICE)',
      imageUrl: '/images/menus/IceAme.jpg'
    },
    {
      name: '카페라떼',
      imageUrl: '/images/menus/Caramel.png'
    },
    // ... 추가 메뉴들
  ];

  for (const update of updates) {
    await pool.query(
      'UPDATE menus SET "imageUrl" = $1 WHERE name = $2',
      [update.imageUrl, update.name]
    );
    console.log(`✅ ${update.name} 이미지 업데이트 완료`);
  }
};

updateImages().then(() => {
  console.log('모든 이미지 업데이트 완료!');
  process.exit(0);
});
```

실행:
```bash
cd server
node src/utils/updateImages.js
```

---

## 방법 2: 로컬 이미지 파일 사용 (권장)

### 2-1. 이미지 파일 준비

1. 이미지 파일을 `ui/public/images/menus/` 폴더에 저장
   - 예: `americano-ice.jpg`, `cafe-latte.png` 등

2. 파일 형식: JPG, PNG, WebP 등

3. 권장 크기: 400x300px 또는 비슷한 비율

### 2-2. 데이터베이스 업데이트

로컬 이미지를 사용하려면 경로를 `/images/menus/파일명` 형식으로 설정:

```sql
UPDATE menus SET "imageUrl" = '/images/menus/americano-ice.jpg' WHERE name = '아메리카노(ICE)';
UPDATE menus SET "imageUrl" = '/images/menus/cafe-latte.png' WHERE name = '카페라떼';
```

**참고**: 
- `public` 폴더의 파일은 `/`로 시작하는 경로로 접근 가능
- 빌드 시 `public` 폴더 내용이 그대로 복사됨

---

## 방법 3: 외부 URL 사용 (현재 방식)

### 3-1. Unsplash URL 변경

```sql
UPDATE menus 
SET "imageUrl" = 'https://images.unsplash.com/photo-새로운_이미지_ID?w=400&h=300&fit=crop' 
WHERE name = '아메리카노(ICE)';
```

### 3-2. 다른 이미지 호스팅 서비스 사용

- **Imgur**: `https://i.imgur.com/이미지ID.jpg`
- **Cloudinary**: `https://res.cloudinary.com/계정/이미지ID.jpg`
- **자체 서버**: `https://yourdomain.com/images/coffee.jpg`

---

## 방법 4: seed.js 파일 수정 후 재초기화

### 4-1. seed.js 파일 수정

`server/src/database/seed.js` 파일에서 `imageUrl` 값 수정:

```javascript
{
  name: '아메리카노(ICE)',
  description: '시원하고 깔끔한 아이스 아메리카노',
  price: 4000,
  imageUrl: '/images/menus/IceAme.jpg', // 변경
  stock: 10
}
```

### 4-2. 데이터베이스 재초기화

⚠️ **주의**: 기존 데이터가 모두 삭제됩니다!

```bash
# 데이터베이스 초기화 (스키마 + 시드 데이터)
cd server
npm run init-db
```

또는 기존 데이터 유지하면서 이미지만 업데이트하려면 방법 1 사용

---

## 방법 5: 관리자 페이지에 이미지 업로드 기능 추가 (고급)

### 5-1. 백엔드에 이미지 업로드 API 추가

```javascript
// server/src/routes/adminRoutes.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../ui/public/images/menus/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/menus/:menuId/image', upload.single('image'), async (req, res) => {
  // 이미지 업로드 및 DB 업데이트 로직
});
```

### 5-2. 프런트엔드에 업로드 UI 추가

관리자 페이지에 이미지 업로드 폼 추가

---

## 추천 방법 비교

| 방법 | 난이도 | 장점 | 단점 |
|------|--------|------|------|
| **방법 1: SQL 직접 수정** | ⭐ 쉬움 | 빠르고 간단 | SQL 지식 필요 |
| **방법 2: 로컬 이미지** | ⭐⭐ 보통 | 빠른 로딩, 오프라인 가능 | 파일 관리 필요 |
| **방법 3: 외부 URL** | ⭐ 쉬움 | 파일 관리 불필요 | 인터넷 필요, 느릴 수 있음 |
| **방법 4: seed.js 수정** | ⭐⭐ 보통 | 코드로 관리 | 데이터 초기화 필요 |
| **방법 5: 업로드 기능** | ⭐⭐⭐ 어려움 | 사용자 친화적 | 개발 시간 필요 |

---

## 빠른 시작 (방법 2 추천)

### 단계별 가이드

1. **이미지 파일 준비**
   ```
   ui/public/images/menus/
   ├── americano-ice.jpg
   ├── americano-hot.jpg
   ├── cafe-latte.jpg
   ├── cappuccino.jpg
   ├── vanilla-latte.jpg
   └── caramel-macchiato.jpg
   ```

2. **SQL 스크립트 실행**
   ```sql
   UPDATE menus SET "imageUrl" = '/images/menus/americano-ice.jpg' WHERE name = '아메리카노(ICE)';
   UPDATE menus SET "imageUrl" = '/images/menus/americano-hot.jpg' WHERE name = '아메리카노(HOT)';
   UPDATE menus SET "imageUrl" = '/images/menus/cafe-latte.jpg' WHERE name = '카페라떼';
   UPDATE menus SET "imageUrl" = '/images/menus/cappuccino.jpg' WHERE name = '카푸치노';
   UPDATE menus SET "imageUrl" = '/images/menus/vanilla-latte.jpg' WHERE name = '바닐라라떼';
   UPDATE menus SET "imageUrl" = '/images/menus/caramel-macchiato.jpg' WHERE name = '카라멜마키아토';
   ```

3. **프런트엔드 재시작**
   ```bash
   cd ui
   npm run dev
   ```

---

## 이미지 최적화 팁

1. **파일 크기**: 각 이미지 100KB 이하 권장
2. **해상도**: 400x300px 또는 800x600px
3. **형식**: 
   - JPG: 사진에 적합
   - PNG: 투명 배경 필요 시
   - WebP: 최신 브라우저, 더 작은 크기

4. **이미지 압축 도구**:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)

---

## 문제 해결

### 이미지가 표시되지 않는 경우

1. **경로 확인**
   - 로컬: `/images/menus/파일명.jpg` (앞에 `/` 필수)
   - 외부: 전체 URL 확인

2. **파일 존재 확인**
   - `ui/public/images/menus/` 폴더에 파일이 있는지 확인

3. **브라우저 콘솔 확인**
   - F12 → Console 탭에서 404 오류 확인

4. **캐시 문제**
   - Ctrl + F5로 강력 새로고침
   - 브라우저 캐시 삭제

---

## 현재 메뉴별 이미지 확인

데이터베이스에서 현재 이미지 URL 확인:

```sql
SELECT name, "imageUrl" FROM menus ORDER BY id;
```

