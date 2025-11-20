import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * 메뉴 이미지 업데이트 스크립트
 * 
 * 사용 방법:
 * 1. 아래 imageMappings 배열에 메뉴 이름과 이미지 URL을 입력
 * 2. node src/utils/updateMenuImages.js 실행
 */

const imageMappings = [
  {
    name: '아메리카노(ICE)',
    imageUrl: '/images/menus/IceAme.jpg' // 로컬 이미지 사용
  },
  {
    name: '아메리카노(HOT)',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop'
  },
  {
    name: '카페라떼',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop'
  },
  {
    name: '카푸치노',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'
  },
  {
    name: '바닐라라떼',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop'
  },
  {
    name: '카라멜마키아토',
    imageUrl: '/images/menus/Caramel.png' // 로컬 이미지 사용
  }
];

async function updateMenuImages() {
  console.log('=== 메뉴 이미지 업데이트 시작 ===\n');

  try {
    for (const mapping of imageMappings) {
      const result = await pool.query(
        'UPDATE menus SET "imageUrl" = $1 WHERE name = $2 RETURNING id, name',
        [mapping.imageUrl, mapping.name]
      );

      if (result.rows.length > 0) {
        console.log(`✅ ${mapping.name}: ${mapping.imageUrl}`);
      } else {
        console.warn(`⚠️  ${mapping.name}: 메뉴를 찾을 수 없습니다.`);
      }
    }

    console.log('\n=== 이미지 업데이트 완료 ===');
    console.log('\n💡 프런트엔드를 새로고침하면 변경된 이미지가 표시됩니다.');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 이미지 업데이트 실패:', error.message);
    await pool.end();
    process.exit(1);
  }
}

updateMenuImages();

