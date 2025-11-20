import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * 특정 메뉴의 이미지만 업데이트하는 스크립트
 */
async function updateSingleImage() {
  const menuName = '아메리카노(ICE)';
  const imageUrl = '/images/menus/IceAme.jpg';

  console.log(`=== ${menuName} 이미지 업데이트 ===\n`);

  try {
    // 메뉴 존재 확인
    const checkResult = await pool.query(
      'SELECT id, name, "imageUrl" FROM menus WHERE name = $1',
      [menuName]
    );

    if (checkResult.rows.length === 0) {
      console.error(`❌ 메뉴를 찾을 수 없습니다: ${menuName}`);
      await pool.end();
      process.exit(1);
    }

    const currentMenu = checkResult.rows[0];
    console.log(`현재 이미지: ${currentMenu.imageUrl || '(없음)'}`);

    // 이미지 업데이트
    const result = await pool.query(
      'UPDATE menus SET "imageUrl" = $1 WHERE name = $2 RETURNING id, name, "imageUrl"',
      [imageUrl, menuName]
    );

    if (result.rows.length > 0) {
      const updatedMenu = result.rows[0];
      console.log(`✅ 이미지 업데이트 완료!`);
      console.log(`   메뉴: ${updatedMenu.name}`);
      console.log(`   새 이미지: ${updatedMenu.imageUrl}`);
      console.log(`\n💡 프런트엔드를 새로고침하면 변경된 이미지가 표시됩니다.`);
    } else {
      console.error(`❌ 이미지 업데이트 실패`);
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 이미지 업데이트 실패:', error.message);
    await pool.end();
    process.exit(1);
  }
}

updateSingleImage();

