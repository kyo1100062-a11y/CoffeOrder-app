import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function insertOptions() {
  console.log('=== 옵션 데이터 삽입 ===\n');

  try {
    // 메뉴 목록 조회
    const menus = await pool.query('SELECT id FROM menus ORDER BY id');
    
    if (menus.rows.length === 0) {
      console.error('❌ 메뉴가 없습니다. 먼저 메뉴를 생성하세요.');
      await pool.end();
      process.exit(1);
    }

    // 기존 옵션 확인
    const existingOptions = await pool.query('SELECT COUNT(*) as count FROM options');
    if (parseInt(existingOptions.rows[0].count) > 0) {
      console.log('⚠️  이미 옵션이 존재합니다. 기존 옵션을 삭제하고 다시 삽입합니다.');
      await pool.query('DELETE FROM options');
    }

    // 각 메뉴에 옵션 추가
    let insertedCount = 0;
    for (const menu of menus.rows) {
      await pool.query(
        'INSERT INTO options (name, price, "menuId") VALUES ($1, $2, $3)',
        ['샷 추가', 500, menu.id]
      );
      await pool.query(
        'INSERT INTO options (name, price, "menuId") VALUES ($1, $2, $3)',
        ['시럽 추가', 0, menu.id]
      );
      insertedCount += 2;
    }

    console.log(`✅ 옵션 ${insertedCount}개 삽입 완료!`);
    console.log(`   (메뉴 ${menus.rows.length}개 × 옵션 2개)`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 옵션 삽입 실패:', error.message);
    await pool.end();
    process.exit(1);
  }
}

insertOptions();

