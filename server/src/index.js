import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드 (.env 파일 경로 명시)
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// PORT 환경 변수 검증
const PORT = parseInt(process.env.PORT, 10) || 3001;
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('❌ PORT 값이 유효하지 않습니다:', process.env.PORT);
  process.exit(1);
}

// 미들웨어 설정
// CORS 설정: 허용할 origin 목록
const allowedOrigins = [
  'http://localhost:5173',              // 로컬 개발용
  'https://coffeorder-app.onrender.com' // 프런트엔드 배포 주소
];

const corsOptions = {
  origin: function (origin, callback) {
    // origin이 없으면 (같은 도메인 요청 등) 허용
    if (!origin) {
      return callback(null, true);
    }
    
    // 허용된 origin 목록에 있는지 확인
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS 차단: ${origin}은(는) 허용되지 않은 origin입니다.`);
      callback(new Error('CORS 정책에 의해 차단되었습니다.'));
    }
  },
  credentials: true, // 쿠키 및 인증 정보 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: '커피 주문 앱 백엔드 서버에 오신 것을 환영합니다!',
    version: '1.0.0'
  });
});

// API 라우트
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ 
    error: '요청한 리소스를 찾을 수 없습니다.' 
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.' 
  });
});

// 서버 시작
app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}`);
  
  // 데이터베이스 연결 테스트
  await testConnection();
});

