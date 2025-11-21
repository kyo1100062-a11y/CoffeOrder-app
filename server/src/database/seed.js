import pool from '../config/database.js';

/**
 * 초기 데이터 삽입
 */
const seedData = async () => {
  try {
    console.log('초기 데이터 삽입 중...');

    // 기존 데이터 확인
    const menuCheck = await pool.query('SELECT COUNT(*) FROM menus');
    if (parseInt(menuCheck.rows[0].count) > 0) {
      console.log('이미 데이터가 존재합니다. 초기 데이터를 건너뜁니다.');
      return;
    }

    // 메뉴 데이터 삽입
    const menuQueries = [
      {
        name: '아메리카노(ICE)',
        description: '시원하고 깔끔한 아이스 아메리카노',
        price: 4000,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
        stock: 10
      },
      {
        name: '아메리카노(HOT)',
        description: '따뜻하고 진한 핫 아메리카노',
        price: 4000,
        imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
        stock: 10
      },
      {
        name: '카페라떼',
        description: '부드러운 우유와 에스프레소의 조화',
        price: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
        stock: 10
      },
      {
        name: '카푸치노',
        description: '우유 거품이 올라간 부드러운 카푸치노',
        price: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
        stock: 3
      },
      {
        name: '바닐라라떼',
        description: '달콤한 바닐라 시럽이 들어간 라떼',
        price: 5500,
        imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
        stock: 0
      },
      {
        name: '카라멜마키아토',
        description: '카라멜 시럽과 에스프레소의 달콤한 만남',
        price: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
        stock: 8
      }
    ];

    const insertedMenus = [];
    for (const menu of menuQueries) {
      const result = await pool.query(
        'INSERT INTO menus (name, description, price, "imageUrl", stock) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [menu.name, menu.description, menu.price, menu.imageUrl, menu.stock]
      );
      insertedMenus.push({ id: result.rows[0].id, ...menu });
    }

    // 옵션 데이터 삽입 (모든 메뉴에 동일한 옵션 추가)
    for (const menu of insertedMenus) {
      await pool.query(
        'INSERT INTO options (name, price, "menuId") VALUES ($1, $2, $3)',
        ['샷 추가', 500, menu.id]
      );
      await pool.query(
        'INSERT INTO options (name, price, "menuId") VALUES ($1, $2, $3)',
        ['시럽 추가', 0, menu.id]
      );
    }

    console.log('초기 데이터 삽입 완료!');
    console.log(`- 메뉴 ${insertedMenus.length}개 삽입`);
    console.log(`- 옵션 ${insertedMenus.length * 2}개 삽입`);
  } catch (error) {
    console.error('초기 데이터 삽입 실패:', error);
    throw error;
  }
};

// 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('초기 데이터 삽입 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('초기 데이터 삽입 실패:', error);
      process.exit(1);
    });
}

export default seedData;

