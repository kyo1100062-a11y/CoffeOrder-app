import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    
    // SQL 문을 세미콜론으로 분리하여 실행
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
      }
    }

    console.log('데이터베이스 스키마 초기화 완료!');
    return true;
  } catch (error) {
    console.error('데이터베이스 스키마 초기화 실패:', error);
    throw error;
  }
};

// 직접 실행 시 (npm run init-db)
if (import.meta.url === `file://${process.argv[1]}`) {
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

