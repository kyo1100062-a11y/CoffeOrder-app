# 커피 주문 앱
## 1. 프로젝트 개요
### 1.1. 프로젝트명
커피 주문 앱
### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 준문을 관리할 수 있는 간단한 풀스택 웨 앱
### 1. 3 개발범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제 할 수 있는 기능
## 2. 기술 스택
- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL
## 3. 기본사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 주문하기 화면 상세 명세

### 4.1. 화면 구조
주문하기 화면은 다음과 같은 영역으로 구성됩니다:
- **헤더 영역**: 상단 고정 영역
- **메뉴 목록 영역**: 메뉴 카드들이 표시되는 영역
- **장바구니 영역**: 선택한 메뉴가 표시되는 영역

### 4.2. 헤더 영역
#### 4.2.1. 구성 요소
- **로고/브랜드명**: 좌측 상단에 "Hong's Cafe" 표시
- **주문하기 버튼**: 우측 상단에 "주문하기" 버튼 (현재 화면이므로 활성화 상태)
- **관리자 버튼**: 우측 상단에 "관리자" 버튼 (관리자 화면으로 이동)

#### 4.2.2. 기능 요구사항
- 관리자 버튼 클릭 시 관리자 화면으로 이동
- 주문하기 버튼은 현재 화면 표시용 (클릭 시 동작 없음 또는 현재 화면 유지)

### 4.3. 메뉴 목록 영역
#### 4.3.1. 메뉴 카드 구조
각 메뉴는 카드 형태로 표시되며, 다음 정보를 포함합니다:
- **메뉴 이미지**: 메뉴 사진 (이미지가 없을 경우 플레이스홀더 표시)
- **메뉴명**: 메뉴 이름 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
- **가격**: 기본 가격 (예: "4,000원", "5,000원")
- **설명**: 메뉴에 대한 간단한 설명 (예: "간단한 설명...")
- **옵션 체크박스**:
  - "샷 추가 (+500원)": 체크 시 추가 가격 500원
  - "시럽 추가 (+0원)": 체크 시 추가 가격 0원 (무료 옵션)
- **담기 버튼**: 장바구니에 추가하는 버튼

#### 4.3.2. 기능 요구사항
- 메뉴 목록은 백엔드 API를 통해 조회하여 동적으로 표시
- 각 메뉴 카드의 옵션은 독립적으로 선택 가능
- "담기" 버튼 클릭 시:
  - 선택한 옵션과 함께 메뉴를 장바구니에 추가
  - 동일한 메뉴와 옵션 조합이 이미 장바구니에 있으면 수량 증가
  - 옵션이 다른 경우 별도 항목으로 추가
  - 담기 후 옵션 체크박스는 초기화 (선택 해제)

#### 4.3.3. 레이아웃
- 메뉴 카드들은 가로로 나열 (반응형: 화면 크기에 따라 열 개수 조정)
- 카드 간 적절한 간격 유지

### 4.4. 장바구니 영역
#### 4.4.1. 구성 요소
- **장바구니 제목**: "장바구니" 표시
- **장바구니 아이템 목록**: 선택한 메뉴들이 표시됨
  - 각 아이템 표시 형식: "메뉴명 (옵션명) X 수량" + 가격
  - 예시: "아메리카노(ICE) (샷 추가) X 1" - "4,500원"
  - 예시: "아메리카노(HOT) X 2" - "8,000원"
- **총 금액**: "총 금액 XX,XXX원" 형식으로 표시
- **주문하기 버튼**: 장바구니 하단에 위치

#### 4.4.2. 기능 요구사항
- 장바구니에 아이템이 없을 경우 빈 상태 표시 또는 안내 메시지
- 각 장바구니 아이템의 가격 계산:
  - 기본 가격 + 선택한 옵션의 추가 가격
  - 수량이 2개 이상인 경우: (기본 가격 + 옵션 가격) × 수량
- 총 금액은 모든 장바구니 아이템의 가격 합계
- 총 금액은 천 단위 구분 기호(쉼표)를 사용하여 표시
- "주문하기" 버튼 클릭 시:
  - 장바구니의 모든 아이템을 주문으로 전송
  - 주문 성공 시 장바구니 비우기
  - 주문 완료 메시지 표시 (선택 사항)

#### 4.4.3. 장바구니 아이템 관리 (추가 기능)
- 각 아이템의 수량 조절 기능 (증가/감소 버튼)
- 각 아이템 삭제 기능 (X 버튼 또는 삭제 버튼)
- 수량 변경 시 총 금액 자동 재계산

### 4.5. 사용자 플로우
1. 사용자가 주문하기 화면에 진입
2. 메뉴 목록에서 원하는 메뉴 선택
3. 필요 시 옵션 선택 (샷 추가, 시럽 추가)
4. "담기" 버튼 클릭하여 장바구니에 추가
5. 장바구니에서 선택한 메뉴 확인 및 수량 조절 (선택 사항)
6. 총 금액 확인
7. "주문하기" 버튼 클릭하여 주문 완료

### 4.6. 데이터 구조
#### 4.6.1. 메뉴 데이터
```javascript
{
  id: number,
  name: string,
  price: number,
  description: string,
  imageUrl: string | null,
  options: [
    {
      id: number,
      name: string,
      price: number
    }
  ]
}
```

#### 4.6.2. 장바구니 아이템 데이터
```javascript
{
  menuId: number,
  menuName: string,
  basePrice: number,
  selectedOptions: [
    {
      optionId: number,
      optionName: string,
      optionPrice: number
    }
  ],
  quantity: number,
  totalPrice: number
}
```

### 4.7. API 요구사항
- `GET /api/menus`: 메뉴 목록 조회
- `POST /api/orders`: 주문 생성 (장바구니 데이터 전송)

### 4.8. UI/UX 요구사항
- 반응형 디자인: 다양한 화면 크기 지원
- 직관적인 인터페이스: 사용자가 쉽게 메뉴를 선택하고 주문할 수 있도록
- 명확한 가격 표시: 각 메뉴와 옵션의 가격이 명확히 표시
- 실시간 총액 계산: 장바구니 변경 시 즉시 총액 업데이트

## 5. 관리자 화면 상세 명세

### 5.1. 화면 구조
관리자 화면은 다음과 같은 영역으로 구성됩니다:
- **헤더 영역**: 상단 고정 영역
- **관리자 대시보드 영역**: 주문 통계 요약
- **재고 현황 영역**: 메뉴별 재고 수량 관리
- **주문 현황 영역**: 주문 목록 및 상태 관리

### 5.2. 헤더 영역
#### 5.2.1. 구성 요소
- **로고/브랜드명**: 좌측 상단에 "Hong's Cafe" 표시
- **주문하기 버튼**: 우측 상단에 "주문하기" 버튼 (주문하기 화면으로 이동)
- **관리자 버튼**: 우측 상단에 "관리자" 버튼 (현재 화면이므로 활성화 상태)

#### 5.2.2. 기능 요구사항
- 주문하기 버튼 클릭 시 주문하기 화면으로 이동
- 관리자 버튼은 현재 화면 표시용 (클릭 시 동작 없음 또는 현재 화면 유지)

### 5.3. 관리자 대시보드 영역
#### 5.3.1. 구성 요소
주문 상태별 통계를 카드 형태로 표시:
- **총 주문**: 전체 주문 건수
- **주문 접수**: "주문 접수" 상태인 주문 건수
- **제조 중**: "제조 중" 상태인 주문 건수
- **제조 완료**: "제조 완료" 상태인 주문 건수

#### 5.3.2. 기능 요구사항
- 각 통계는 실시간으로 업데이트
- 주문 상태가 변경되면 해당 통계 자동 갱신
- 통계는 백엔드 API를 통해 조회

#### 5.3.3. 레이아웃
- 통계 카드들은 가로로 나열
- 각 카드에 숫자와 라벨이 명확히 표시

### 5.4. 재고 현황 영역
#### 5.4.1. 구성 요소
각 메뉴별 재고 카드가 표시되며, 다음 정보를 포함합니다:
- **메뉴명**: 메뉴 이름 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
- **재고 수량**: 현재 재고 수량 (예: "10개")
- **재고 조절 버튼**:
  - **증가 버튼 (+)**: 재고 수량 증가
  - **감소 버튼 (-)**: 재고 수량 감소

#### 5.4.2. 기능 요구사항
- 재고 수량은 백엔드 API를 통해 조회하여 표시
- "+" 버튼 클릭 시:
  - 해당 메뉴의 재고 수량 1 증가
  - 백엔드 API를 통해 재고 수량 업데이트
  - 화면에 즉시 반영
- "-" 버튼 클릭 시:
  - 해당 메뉴의 재고 수량 1 감소
  - 재고가 0보다 작아지지 않도록 제한 (0 이하로 감소 불가)
  - 백엔드 API를 통해 재고 수량 업데이트
  - 화면에 즉시 반영
- 재고 수량은 천 단위 구분 기호(쉼표)를 사용하여 표시 (예: "1,000개")

#### 5.4.3. 레이아웃
- 재고 카드들은 가로로 나열 (반응형: 화면 크기에 따라 열 개수 조정)
- 각 카드에 메뉴명, 재고 수량, 조절 버튼이 명확히 표시

### 5.5. 주문 현황 영역
#### 5.5.1. 구성 요소
주문 목록이 표시되며, 각 주문 항목은 다음 정보를 포함합니다:
- **주문 날짜/시간**: 주문이 접수된 날짜와 시간 (예: "7월 31일 13:00")
- **주문 메뉴 정보**: 
  - 메뉴명과 옵션 (예: "아메리카노(ICE)")
  - 수량 (예: "x 1")
- **주문 금액**: 해당 주문의 총 금액 (예: "4,000원")
- **상태 버튼**: 주문 상태에 따른 버튼
  - "주문 접수": 주문이 접수된 상태
  - "제조 중": 주문이 제조 중인 상태
  - "제조 완료": 주문이 제조 완료된 상태

#### 5.5.2. 기능 요구사항
- 주문 목록은 최신 주문이 위에 오도록 정렬 (최신순)
- 주문 목록은 백엔드 API를 통해 조회하여 동적으로 표시
- 주문이 없을 경우 빈 상태 표시 또는 안내 메시지
- 상태 버튼 클릭 시:
  - 주문 상태가 다음 단계로 변경
  - 상태 변경 흐름: "주문 접수" → "제조 중" → "제조 완료"
  - "제조 완료" 상태에서는 더 이상 상태 변경 불가 (또는 버튼 비활성화)
  - 백엔드 API를 통해 주문 상태 업데이트
  - 화면에 즉시 반영
  - 대시보드 통계 자동 업데이트
- 주문 금액은 천 단위 구분 기호(쉼표)를 사용하여 표시
- 각 주문 항목에 여러 메뉴가 포함된 경우 모두 표시 (또는 요약 표시)

#### 5.5.3. 레이아웃
- 주문 목록은 세로로 나열
- 각 주문 항목은 카드 형태 또는 리스트 형태로 표시
- 주문 정보와 상태 버튼이 명확히 구분되어 표시

### 5.6. 사용자 플로우
1. 관리자가 관리자 화면에 진입
2. 대시보드에서 전체 주문 현황 파악
3. 재고 현황에서 필요 시 재고 수량 조절
4. 주문 현황에서 주문 목록 확인
5. 각 주문의 상태 버튼을 클릭하여 주문 상태 업데이트
6. 주문 상태 변경에 따라 대시보드 통계 자동 업데이트

### 5.7. 데이터 구조
#### 5.7.1. 대시보드 통계 데이터
```javascript
{
  totalOrders: number,
  receivedOrders: number,
  inProductionOrders: number,
  completedOrders: number
}
```

#### 5.7.2. 재고 데이터
```javascript
{
  menuId: number,
  menuName: string,
  stock: number
}
```

#### 5.7.3. 주문 데이터
```javascript
{
  id: number,
  orderDate: string, // ISO 8601 형식 또는 타임스탬프
  items: [
    {
      menuId: number,
      menuName: string,
      options: [
        {
          optionId: number,
          optionName: string
        }
      ],
      quantity: number,
      price: number
    }
  ],
  totalPrice: number,
  status: "주문 접수" | "제조 중" | "제조 완료"
}
```

### 5.8. API 요구사항
- `GET /api/admin/dashboard`: 대시보드 통계 조회
- `GET /api/admin/stock`: 재고 현황 조회
- `PUT /api/admin/stock/:menuId`: 재고 수량 업데이트
- `GET /api/admin/orders`: 주문 목록 조회
- `PUT /api/admin/orders/:orderId/status`: 주문 상태 업데이트

### 5.9. UI/UX 요구사항
- 반응형 디자인: 다양한 화면 크기 지원
- 실시간 업데이트: 주문 상태 변경 시 즉시 화면 반영
- 명확한 상태 표시: 각 주문의 현재 상태가 명확히 표시
- 직관적인 조작: 재고 조절과 주문 상태 변경이 쉽게 가능하도록
- 시각적 피드백: 버튼 클릭 시 즉각적인 시각적 피드백 제공

## 6. 백엔드 개발 명세

### 6.1. 데이터 모델

#### 6.1.1. Menus (메뉴)
메뉴 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY): 메뉴 고유 식별자 (자동 증가)
- `name` (VARCHAR): 커피 이름 (예: "아메리카노(ICE)", "카페라떼")
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER): 기본 가격 (원 단위)
- `imageUrl` (VARCHAR, NULL 허용): 메뉴 이미지 URL
- `stock` (INTEGER): 재고 수량 (기본값: 0)
- `createdAt` (TIMESTAMP): 생성 일시
- `updatedAt` (TIMESTAMP): 수정 일시

**제약 조건:**
- `name`은 필수이며 중복 불가
- `price`는 0 이상의 정수
- `stock`은 0 이상의 정수

#### 6.1.2. Options (옵션)
메뉴에 추가할 수 있는 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY): 옵션 고유 식별자 (자동 증가)
- `name` (VARCHAR): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (INTEGER): 옵션 추가 가격 (원 단위, 0 이상)
- `menuId` (FOREIGN KEY): 연결된 메뉴 ID (Menus 테이블 참조)
- `createdAt` (TIMESTAMP): 생성 일시
- `updatedAt` (TIMESTAMP): 수정 일시

**제약 조건:**
- `menuId`는 Menus 테이블의 id를 참조
- `price`는 0 이상의 정수
- 메뉴 삭제 시 연결된 옵션도 함께 삭제 (CASCADE)

#### 6.1.3. Orders (주문)
주문 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY): 주문 고유 식별자 (자동 증가)
- `orderDate` (TIMESTAMP): 주문 일시 (기본값: 현재 시간)
- `status` (VARCHAR): 주문 상태 ("주문 접수", "제조 중", "제조 완료")
- `totalPrice` (INTEGER): 주문 총 금액 (원 단위)
- `createdAt` (TIMESTAMP): 생성 일시
- `updatedAt` (TIMESTAMP): 수정 일시

**제약 조건:**
- `status`는 "주문 접수", "제조 중", "제조 완료" 중 하나
- `totalPrice`는 0 이상의 정수

#### 6.1.4. OrderItems (주문 항목)
주문에 포함된 메뉴와 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY): 주문 항목 고유 식별자 (자동 증가)
- `orderId` (FOREIGN KEY): 주문 ID (Orders 테이블 참조)
- `menuId` (FOREIGN KEY): 메뉴 ID (Menus 테이블 참조)
- `menuName` (VARCHAR): 주문 시점의 메뉴 이름 (스냅샷)
- `quantity` (INTEGER): 주문 수량
- `price` (INTEGER): 해당 항목의 총 가격 (메뉴 가격 + 옵션 가격) × 수량
- `createdAt` (TIMESTAMP): 생성 일시

**제약 조건:**
- `orderId`는 Orders 테이블의 id를 참조
- `menuId`는 Menus 테이블의 id를 참조
- `quantity`는 1 이상의 정수
- `price`는 0 이상의 정수
- 주문 삭제 시 연결된 주문 항목도 함께 삭제 (CASCADE)

#### 6.1.5. OrderItemOptions (주문 항목 옵션)
주문 항목에 선택된 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY): 주문 항목 옵션 고유 식별자 (자동 증가)
- `orderItemId` (FOREIGN KEY): 주문 항목 ID (OrderItems 테이블 참조)
- `optionId` (FOREIGN KEY): 옵션 ID (Options 테이블 참조)
- `optionName` (VARCHAR): 주문 시점의 옵션 이름 (스냅샷)
- `optionPrice` (INTEGER): 주문 시점의 옵션 가격 (스냅샷)
- `createdAt` (TIMESTAMP): 생성 일시

**제약 조건:**
- `orderItemId`는 OrderItems 테이블의 id를 참조
- `optionId`는 Options 테이블의 id를 참조
- 주문 항목 삭제 시 연결된 옵션도 함께 삭제 (CASCADE)

### 6.2. 데이터 스키마를 위한 사용자 흐름

#### 6.2.1. 메뉴 목록 조회 흐름
1. 사용자가 주문하기 화면에 진입
2. 프런트엔드에서 `GET /api/menus` API 호출
3. 백엔드에서 Menus 테이블에서 모든 메뉴 조회
4. 각 메뉴에 연결된 Options 테이블에서 옵션 정보 조회
5. 메뉴와 옵션 정보를 조합하여 JSON 형태로 반환
6. 프런트엔드에서 메뉴 카드 형태로 화면에 표시
7. 관리자 화면에서는 Menus 테이블의 `stock` 필드를 조회하여 재고 현황에 표시

#### 6.2.2. 주문 생성 흐름
1. 사용자가 장바구니에서 "주문하기" 버튼 클릭
2. 프런트엔드에서 주문 정보를 `POST /api/orders` API로 전송
   - 주문 항목 목록 (메뉴 ID, 수량, 선택한 옵션 ID 목록)
3. 백엔드에서 주문 처리:
   - Orders 테이블에 새 주문 레코드 생성 (status: "주문 접수")
   - 각 주문 항목에 대해 OrderItems 테이블에 레코드 생성
   - 각 주문 항목의 옵션에 대해 OrderItemOptions 테이블에 레코드 생성
   - 주문 총액 계산 및 저장
4. 주문 생성 성공 응답 반환
5. 프런트엔드에서 장바구니 비우기 및 주문 완료 메시지 표시

#### 6.2.3. 주문 현황 조회 흐름
1. 관리자가 관리자 화면의 "주문 현황" 영역 진입
2. 프런트엔드에서 `GET /api/admin/orders` API 호출
3. 백엔드에서 Orders 테이블에서 모든 주문 조회 (최신순 정렬)
4. 각 주문에 대해 OrderItems와 OrderItemOptions 정보 조회
5. 주문 정보를 JSON 형태로 반환
6. 프런트엔드에서 주문 목록으로 표시

#### 6.2.4. 주문 상태 변경 흐름
1. 관리자가 주문 현황에서 상태 버튼 클릭 (예: "제조시작" 버튼)
2. 프런트엔드에서 `PUT /api/admin/orders/:orderId/status` API 호출
   - 새로운 상태 값 전송 (예: "제조 중")
3. 백엔드에서 주문 상태 업데이트:
   - Orders 테이블에서 해당 주문의 status 필드 업데이트
   - 상태가 "제조 완료"로 변경되는 경우:
     - 해당 주문의 OrderItems를 조회
     - 각 주문 항목의 메뉴에 대해 Menus 테이블의 stock을 수량만큼 차감
     - 재고가 0 미만이 되지 않도록 검증
4. 업데이트 성공 응답 반환
5. 프런트엔드에서 주문 상태 및 통계 업데이트

#### 6.2.5. 재고 관리 흐름
1. 관리자가 재고 현황에서 재고 수량 조절 (+/- 버튼 또는 직접 입력)
2. 프런트엔드에서 `PUT /api/admin/stock/:menuId` API 호출
   - 새로운 재고 수량 전송
3. 백엔드에서 재고 업데이트:
   - Menus 테이블에서 해당 메뉴의 stock 필드 업데이트
   - 재고가 0 미만이 되지 않도록 검증
4. 업데이트 성공 응답 반환
5. 프런트엔드에서 재고 현황 업데이트

### 6.3. API 설계

#### 6.3.1. 메뉴 관련 API

##### GET /api/menus
주문하기 화면에서 커피 메뉴 목록을 조회합니다.

**요청:**
- Method: GET
- Headers: 없음
- Body: 없음

**응답:**
- Status: 200 OK
- Body:
```json
[
  {
    "id": 1,
    "name": "아메리카노(ICE)",
    "price": 4000,
    "description": "시원하고 깔끔한 아이스 아메리카노",
    "imageUrl": "https://images.unsplash.com/...",
    "options": [
      {
        "id": 1,
        "name": "샷 추가",
        "price": 500
      },
      {
        "id": 2,
        "name": "시럽 추가",
        "price": 0
      }
    ]
  }
]
```

**에러 응답:**
- 500 Internal Server Error: 서버 오류

#### 6.3.2. 주문 관련 API

##### POST /api/orders
사용자가 장바구니에서 주문하기 버튼을 클릭할 때 주문 정보를 저장합니다.

**요청:**
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "items": [
    {
      "menuId": 1,
      "quantity": 2,
      "selectedOptionIds": [1, 2]
    },
    {
      "menuId": 3,
      "quantity": 1,
      "selectedOptionIds": [1]
    }
  ]
}
```

**응답:**
- Status: 201 Created
- Body:
```json
{
  "id": 1,
  "orderDate": "2024-01-15T10:30:00Z",
  "status": "주문 접수",
  "totalPrice": 14500,
  "items": [
    {
      "id": 1,
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "quantity": 2,
      "price": 9000,
      "options": [
        {
          "optionId": 1,
          "optionName": "샷 추가",
          "optionPrice": 500
        },
        {
          "optionId": 2,
          "optionName": "시럽 추가",
          "optionPrice": 0
        }
      ]
    }
  ]
}
```

**에러 응답:**
- 400 Bad Request: 잘못된 요청 데이터
- 404 Not Found: 존재하지 않는 메뉴 ID 또는 옵션 ID
- 500 Internal Server Error: 서버 오류

##### GET /api/orders/:orderId
주문 ID를 전달하면 해당 주문 정보를 조회합니다.

**요청:**
- Method: GET
- Headers: 없음
- Path Parameters:
  - `orderId`: 주문 ID

**응답:**
- Status: 200 OK
- Body:
```json
{
  "id": 1,
  "orderDate": "2024-01-15T10:30:00Z",
  "status": "주문 접수",
  "totalPrice": 14500,
  "items": [
    {
      "id": 1,
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "quantity": 2,
      "price": 9000,
      "options": [
        {
          "optionId": 1,
          "optionName": "샷 추가",
          "optionPrice": 500
        }
      ]
    }
  ]
}
```

**에러 응답:**
- 404 Not Found: 존재하지 않는 주문 ID
- 500 Internal Server Error: 서버 오류

#### 6.3.3. 관리자 API

##### GET /api/admin/dashboard
관리자 대시보드의 주문 통계를 조회합니다.

**요청:**
- Method: GET
- Headers: 없음
- Body: 없음

**응답:**
- Status: 200 OK
- Body:
```json
{
  "totalOrders": 10,
  "receivedOrders": 3,
  "inProductionOrders": 5,
  "completedOrders": 2
}
```

**에러 응답:**
- 500 Internal Server Error: 서버 오류

##### GET /api/admin/stock
관리자 화면의 재고 현황을 조회합니다.

**요청:**
- Method: GET
- Headers: 없음
- Body: 없음

**응답:**
- Status: 200 OK
- Body:
```json
[
  {
    "menuId": 1,
    "menuName": "아메리카노(ICE)",
    "stock": 10
  },
  {
    "menuId": 2,
    "menuName": "아메리카노(HOT)",
    "stock": 5
  }
]
```

**에러 응답:**
- 500 Internal Server Error: 서버 오류

##### PUT /api/admin/stock/:menuId
관리자가 재고 수량을 수정합니다.

**요청:**
- Method: PUT
- Headers: `Content-Type: application/json`
- Path Parameters:
  - `menuId`: 메뉴 ID
- Body:
```json
{
  "stock": 15
}
```

**응답:**
- Status: 200 OK
- Body:
```json
{
  "menuId": 1,
  "menuName": "아메리카노(ICE)",
  "stock": 15
}
```

**에러 응답:**
- 400 Bad Request: 잘못된 재고 수량 (음수 등)
- 404 Not Found: 존재하지 않는 메뉴 ID
- 500 Internal Server Error: 서버 오류

##### GET /api/admin/orders
관리자 화면의 주문 목록을 조회합니다.

**요청:**
- Method: GET
- Headers: 없음
- Body: 없음
- Query Parameters (선택):
  - `status`: 주문 상태 필터 ("주문 접수", "제조 중", "제조 완료")

**응답:**
- Status: 200 OK
- Body:
```json
[
  {
    "id": 1,
    "orderDate": "2024-01-15T10:30:00Z",
    "status": "주문 접수",
    "totalPrice": 14500,
    "items": [
      {
        "id": 1,
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "quantity": 2,
        "price": 9000,
        "options": [
          {
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          }
        ]
      }
    ]
  }
]
```

**에러 응답:**
- 500 Internal Server Error: 서버 오류

##### PUT /api/admin/orders/:orderId/status
관리자가 주문 상태를 변경합니다.

**요청:**
- Method: PUT
- Headers: `Content-Type: application/json`
- Path Parameters:
  - `orderId`: 주문 ID
- Body:
```json
{
  "status": "제조 중"
}
```

**응답:**
- Status: 200 OK
- Body:
```json
{
  "id": 1,
  "orderDate": "2024-01-15T10:30:00Z",
  "status": "제조 중",
  "totalPrice": 14500
}
```

**에러 응답:**
- 400 Bad Request: 잘못된 상태 값
- 404 Not Found: 존재하지 않는 주문 ID
- 500 Internal Server Error: 서버 오류

**특별 처리:**
- 상태가 "제조 완료"로 변경될 때:
  - 해당 주문의 모든 OrderItems를 조회
  - 각 주문 항목의 메뉴에 대해 Menus 테이블의 stock을 수량만큼 차감
  - 재고가 부족한 경우 에러 반환 (400 Bad Request)

### 6.4. 데이터베이스 스키마 예시 (PostgreSQL)

```sql
-- Menus 테이블
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  imageUrl VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  menuId INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL CHECK (status IN ('주문 접수', '제조 중', '제조 완료')),
  totalPrice INTEGER NOT NULL CHECK (totalPrice >= 0),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItems 테이블
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  orderId INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menuId INTEGER NOT NULL REFERENCES menus(id),
  menuName VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL CHECK (price >= 0),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItemOptions 테이블
CREATE TABLE order_item_options (
  id SERIAL PRIMARY KEY,
  orderItemId INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  optionId INTEGER NOT NULL REFERENCES options(id),
  optionName VARCHAR(255) NOT NULL,
  optionPrice INTEGER NOT NULL CHECK (optionPrice >= 0),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_options_menuId ON options(menuId);
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_order_items_menuId ON order_items(menuId);
CREATE INDEX idx_order_item_options_orderItemId ON order_item_options(orderItemId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_orderDate ON orders(orderDate DESC);
```

### 6.5. 구현 시 주의사항

1. **트랜잭션 처리**
   - 주문 생성 시 Orders, OrderItems, OrderItemOptions 테이블에 데이터를 삽입하는 작업은 하나의 트랜잭션으로 처리해야 합니다.
   - 주문 상태를 "제조 완료"로 변경하고 재고를 차감하는 작업도 하나의 트랜잭션으로 처리해야 합니다.

2. **데이터 무결성**
   - 주문 시점의 메뉴 이름, 옵션 이름, 가격 정보는 스냅샷으로 저장해야 합니다 (메뉴 정보가 변경되어도 주문 정보는 유지).
   - 재고 차감 시 재고가 부족한 경우 주문 상태 변경을 거부해야 합니다.

3. **에러 처리**
   - 존재하지 않는 메뉴 ID나 옵션 ID로 주문을 생성하려는 경우 적절한 에러 메시지를 반환해야 합니다.
   - 재고가 부족한 경우 명확한 에러 메시지를 반환해야 합니다.

4. **성능 최적화**
   - 메뉴 목록 조회 시 JOIN을 사용하여 옵션 정보를 함께 조회합니다.
   - 주문 목록 조회 시 필요한 모든 정보를 한 번의 쿼리로 조회하도록 최적화합니다.
   - 인덱스를 적절히 활용하여 조회 성능을 향상시킵니다.