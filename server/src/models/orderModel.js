import pool from '../config/database.js';

/**
 * 주문 생성
 */
export const createOrder = async (items, totalPrice) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 주문 생성
    const orderResult = await client.query(
      `INSERT INTO orders (status, "totalPrice") 
       VALUES ('주문 접수', $1) 
       RETURNING id, "orderDate", status, "totalPrice"`,
      [totalPrice]
    );
    
    const order = orderResult.rows[0];
    
    // 주문 항목 및 옵션 생성
    for (const item of items) {
      // 메뉴 정보 조회 (스냅샷 저장)
      const menuResult = await client.query(
        'SELECT name, price FROM menus WHERE id = $1',
        [item.menuId]
      );
      
      if (menuResult.rows.length === 0) {
        throw new Error(`메뉴 ID ${item.menuId}를 찾을 수 없습니다.`);
      }
      
      const menu = menuResult.rows[0];
      
      // 옵션 가격 계산
      let optionPrice = 0;
      if (item.selectedOptionIds && item.selectedOptionIds.length > 0) {
        const optionResult = await client.query(
          'SELECT SUM(price) as total FROM options WHERE id = ANY($1::int[])',
          [item.selectedOptionIds]
        );
        optionPrice = parseInt(optionResult.rows[0].total || 0);
      }
      
      // 주문 항목 생성
      const itemPrice = (menu.price + optionPrice) * item.quantity;
      const orderItemResult = await client.query(
        `INSERT INTO order_items ("orderId", "menuId", "menuName", quantity, price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [order.id, item.menuId, menu.name, item.quantity, itemPrice]
      );
      
      const orderItemId = orderItemResult.rows[0].id;
      
      // 주문 항목 옵션 생성
      if (item.selectedOptionIds && item.selectedOptionIds.length > 0) {
        for (const optionId of item.selectedOptionIds) {
          const optionResult = await client.query(
            'SELECT name, price FROM options WHERE id = $1',
            [optionId]
          );
          
          if (optionResult.rows.length > 0) {
            const option = optionResult.rows[0];
            await client.query(
              `INSERT INTO order_item_options ("orderItemId", "optionId", "optionName", "optionPrice")
               VALUES ($1, $2, $3, $4)`,
              [orderItemId, optionId, option.name, option.price]
            );
          }
        }
      }
    }
    
    await client.query('COMMIT');
    
    // 생성된 주문 정보 반환
    return await getOrderById(order.id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 주문 ID로 주문 조회
 */
export const getOrderById = async (orderId) => {
  const orderQuery = `
    SELECT id, "orderDate", status, "totalPrice"
    FROM orders
    WHERE id = $1
  `;
  
  const orderResult = await pool.query(orderQuery, [orderId]);
  
  if (orderResult.rows.length === 0) {
    return null;
  }
  
  const order = orderResult.rows[0];
  
  // 주문 항목 조회
  const itemsQuery = `
    SELECT 
      oi.id,
      oi."menuId",
      oi."menuName",
      oi.quantity,
      oi.price,
      COALESCE(
        json_agg(
          json_build_object(
            'optionId', oio."optionId",
            'optionName', oio."optionName",
            'optionPrice', oio."optionPrice"
          )
        ) FILTER (WHERE oio.id IS NOT NULL),
        '[]'
      ) as options
    FROM order_items oi
    LEFT JOIN order_item_options oio ON oi.id = oio."orderItemId"
    WHERE oi."orderId" = $1
    GROUP BY oi.id, oi."menuId", oi."menuName", oi.quantity, oi.price
    ORDER BY oi.id
  `;
  
  const itemsResult = await pool.query(itemsQuery, [orderId]);
  
  return {
    ...order,
    items: itemsResult.rows.map(row => ({
      id: row.id,
      menuId: row.menuId,
      menuName: row.menuName,
      quantity: row.quantity,
      price: row.price,
      options: row.options || []
    }))
  };
};

/**
 * 모든 주문 조회 (최신순)
 */
export const getAllOrders = async () => {
  const query = `
    SELECT id, "orderDate", status, "totalPrice"
    FROM orders
    ORDER BY "orderDate" DESC
  `;
  
  const ordersResult = await pool.query(query);
  const orders = ordersResult.rows;
  
  // 각 주문의 항목 정보 조회
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const itemsQuery = `
        SELECT 
          oi.id,
          oi."menuId",
          oi."menuName",
          oi.quantity,
          oi.price,
          COALESCE(
            json_agg(
              json_build_object(
                'optionId', oio."optionId",
                'optionName', oio."optionName",
                'optionPrice', oio."optionPrice"
              )
            ) FILTER (WHERE oio.id IS NOT NULL),
            '[]'
          ) as options
        FROM order_items oi
        LEFT JOIN order_item_options oio ON oi.id = oio."orderItemId"
        WHERE oi."orderId" = $1
        GROUP BY oi.id, oi."menuId", oi."menuName", oi.quantity, oi.price
        ORDER BY oi.id
      `;
      
      const itemsResult = await pool.query(itemsQuery, [order.id]);
      
      return {
        ...order,
        items: itemsResult.rows.map(row => ({
          id: row.id,
          menuId: row.menuId,
          menuName: row.menuName,
          quantity: row.quantity,
          price: row.price,
          options: row.options || []
        }))
      };
    })
  );
  
  return ordersWithItems;
};

/**
 * 주문 상태 업데이트
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 주문 조회
    const orderResult = await client.query(
      'SELECT id, status FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error('주문을 찾을 수 없습니다.');
    }
    
    const currentStatus = orderResult.rows[0].status;
    
    // 상태가 "제조 완료"로 변경되는 경우 재고 차감
    if (currentStatus !== '제조 완료' && newStatus === '제조 완료') {
      // 주문 항목 조회
      const itemsResult = await client.query(
        'SELECT "menuId", quantity FROM order_items WHERE "orderId" = $1',
        [orderId]
      );
      
      // 각 주문 항목의 재고 차감
      for (const item of itemsResult.rows) {
        const stockResult = await client.query(
          'UPDATE menus SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING id',
          [item.quantity, item.menuId]
        );
        
        if (stockResult.rows.length === 0) {
          throw new Error(`메뉴 ID ${item.menuId}의 재고가 부족합니다.`);
        }
      }
    }
    
    // 주문 상태 업데이트
    const updateResult = await client.query(
      `UPDATE orders 
       SET status = $1, "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING id, "orderDate", status, "totalPrice"`,
      [newStatus, orderId]
    );
    
    await client.query('COMMIT');
    
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 주문 삭제 (취소)
 */
export const deleteOrder = async (orderId) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 주문 존재 확인
    const orderResult = await client.query(
      'SELECT id, status FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error('주문을 찾을 수 없습니다.');
    }
    
    // 주문 삭제 (CASCADE로 order_items와 order_item_options도 자동 삭제됨)
    await client.query('DELETE FROM orders WHERE id = $1', [orderId]);
    
    await client.query('COMMIT');
    
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 주문 통계 조회
 */
export const getOrderStats = async () => {
  const query = `
    SELECT 
      COUNT(*) as "totalOrders",
      COUNT(*) FILTER (WHERE status = '주문 접수') as "receivedOrders",
      COUNT(*) FILTER (WHERE status = '제조 중') as "inProductionOrders",
      COUNT(*) FILTER (WHERE status = '제조 완료') as "completedOrders"
    FROM orders
  `;
  
  const result = await pool.query(query);
  return {
    totalOrders: parseInt(result.rows[0].totalOrders),
    receivedOrders: parseInt(result.rows[0].receivedOrders),
    inProductionOrders: parseInt(result.rows[0].inProductionOrders),
    completedOrders: parseInt(result.rows[0].completedOrders)
  };
};

/**
 * 당일 총 매출액 조회 (제조 완료된 주문만)
 */
export const getTodayRevenue = async () => {
  const query = `
    SELECT 
      COALESCE(SUM("totalPrice"), 0) as "todayRevenue"
    FROM orders
    WHERE status = '제조 완료'
      AND DATE("orderDate") = CURRENT_DATE
  `;
  
  const result = await pool.query(query);
  return parseInt(result.rows[0].todayRevenue || 0);
};
