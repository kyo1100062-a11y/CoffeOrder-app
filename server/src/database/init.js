import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import seedData from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 스키마 SQL 파일 읽기
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

/**
 * 데이터베이스 스키마 초기화
 */
export const initDatabase = async () => {
  try {
    console.log('데이터베이스 스키마를 초기화하는 중...');
    
    // SQL 파일을 전체로 실행 (pg가 여러 문장을 처리할 수 있음)
    await pool.query(schemaSQL);

    console.log('데이터베이스 스키마 초기화 완료!');
    
    // 초기 데이터 삽입
    await seedData();
    
    return true;
  } catch (error) {
    console.error('데이터베이스 스키마 초기화 실패:', error);
    throw error;
  }
};

// 직접 실행 시 (npm run init-db)
const isMainModule = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
                     process.argv[1].includes('init.js');

if (isMainModule) {
  initDatabase()
    .then(() => {
      console.log('초기화 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('초기화 실패:', error);
      process.exit(1);
    });
}

