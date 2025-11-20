import pool from '../config/database.js';

/**
 * 모든 메뉴와 옵션 조회
 */
export const getAllMenus = async () => {
  const query = `
    SELECT 
      m.id,
      m.name,
      m.description,
      m.price,
      m."imageUrl",
      m.stock,
      COALESCE(
        json_agg(
          json_build_object(
            'id', o.id,
            'name', o.name,
            'price', o.price
          )
        ) FILTER (WHERE o.id IS NOT NULL),
        '[]'
      ) as options
    FROM menus m
    LEFT JOIN options o ON m.id = o."menuId"
    GROUP BY m.id, m.name, m.description, m.price, m."imageUrl", m.stock
    ORDER BY m.id
  `;
  
  const result = await pool.query(query);
  return result.rows.map(row => ({
    ...row,
    options: row.options || []
  }));
};

/**
 * 메뉴 ID로 메뉴 조회
 */
export const getMenuById = async (menuId) => {
  const query = `
    SELECT 
      m.id,
      m.name,
      m.description,
      m.price,
      m."imageUrl",
      m.stock,
      COALESCE(
        json_agg(
          json_build_object(
            'id', o.id,
            'name', o.name,
            'price', o.price
          )
        ) FILTER (WHERE o.id IS NOT NULL),
        '[]'
      ) as options
    FROM menus m
    LEFT JOIN options o ON m.id = o."menuId"
    WHERE m.id = $1
    GROUP BY m.id, m.name, m.description, m.price, m."imageUrl", m.stock
  `;
  
  const result = await pool.query(query, [menuId]);
  if (result.rows.length === 0) {
    return null;
  }
  
  return {
    ...result.rows[0],
    options: result.rows[0].options || []
  };
};

/**
 * 재고 업데이트
 */
export const updateStock = async (menuId, stock) => {
  const query = `
    UPDATE menus 
    SET stock = $1, "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $2 
    RETURNING id, name, stock
  `;
  
  const result = await pool.query(query, [stock, menuId]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

/**
 * 재고 차감
 */
export const decreaseStock = async (menuId, quantity) => {
  const query = `
    UPDATE menus 
    SET stock = stock - $1 
    WHERE id = $2 AND stock >= $1
    RETURNING id, name, stock
  `;
  
  const result = await pool.query(query, [quantity, menuId]);
  return result.rows[0];
};

/**
 * 모든 메뉴의 재고 정보 조회
 */
export const getAllStock = async () => {
  const query = `
    SELECT id as "menuId", name as "menuName", stock
    FROM menus
    ORDER BY id
  `;
  
  const result = await pool.query(query);
  return result.rows;
};

