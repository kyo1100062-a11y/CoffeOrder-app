import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 경로 명시적으로 지정
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

// DATABASE_URL이 있으면 사용 (Render.com 등), 없으면 개별 환경 변수 사용
let poolConfig;

if (process.env.DATABASE_URL) {
  // Render.com PostgreSQL 등에서 제공하는 DATABASE_URL 사용
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
  console.log('✅ DATABASE_URL을 사용하여 데이터베이스 연결 설정');
} else {
  // 개별 환경 변수 사용 (로컬 개발)
  const requiredEnvVars = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
  };

  // 누락된 환경 변수 확인
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value || value.trim() === '')
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ 필수 환경 변수가 누락되었습니다:', missingVars.join(', '));
    console.error('   server/.env 파일을 확인하고 다음 변수들을 설정하세요:');
    missingVars.forEach(key => {
      console.error(`   ${key}=...`);
    });
    throw new Error(`필수 환경 변수 누락: ${missingVars.join(', ')}`);
  }

  // 포트를 숫자로 변환 및 검증
  const dbPort = parseInt(process.env.DB_PORT, 10);
  if (isNaN(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error(`DB_PORT는 1-65535 사이의 숫자여야 합니다. (현재: ${process.env.DB_PORT})`);
  }

  poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD), // 명시적으로 문자열로 변환
    // Render PostgreSQL은 SSL이 필요합니다
    ssl: process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') 
      ? { rejectUnauthorized: false } 
      : false
  };
  console.log('✅ 개별 환경 변수를 사용하여 데이터베이스 연결 설정');
}

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  ...poolConfig,
  // 연결 풀 설정
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃 (30초)
  connectionTimeoutMillis: 2000, // 연결 타임아웃 (2초)
});

// 연결 테스트
pool.on('connect', () => {
  console.log('데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('데이터베이스 연결 오류:', err);
  process.exit(-1);
});

// 데이터베이스 연결 테스트 함수
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('데이터베이스 연결 성공:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error.message);
    return false;
  }
};

export default pool;

