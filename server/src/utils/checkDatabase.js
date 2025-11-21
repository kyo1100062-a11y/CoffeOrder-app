import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkDatabase() {
  console.log('=== 데이터베이스 상태 확인 ===\n');

  try {
    // 테이블 존재 확인
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ 테이블 목록:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // 메뉴 개수 확인
    const menuCount = await pool.query('SELECT COUNT(*) as count FROM menus');
    console.log(`\n✅ 메뉴 개수: ${menuCount.rows[0].count}`);

    // 옵션 개수 확인
    const optionCount = await pool.query('SELECT COUNT(*) as count FROM options');
    console.log(`✅ 옵션 개수: ${optionCount.rows[0].count}`);

    // 메뉴 목록 확인
    if (parseInt(menuCount.rows[0].count) > 0) {
      const menus = await pool.query('SELECT id, name, price, stock FROM menus ORDER BY id');
      console.log('\n📋 메뉴 목록:');
      menus.rows.forEach(menu => {
        console.log(`   ${menu.id}. ${menu.name} - ${menu.price}원 (재고: ${menu.stock})`);
      });
    }

    await pool.end();
    console.log('\n✅ 데이터베이스 상태 확인 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터베이스 확인 실패:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkDatabase();

