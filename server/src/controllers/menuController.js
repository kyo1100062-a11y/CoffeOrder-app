import * as menuModel from '../models/menuModel.js';

/**
 * 모든 메뉴 조회
 */
export const getAllMenus = async (req, res) => {
  try {
    const menus = await menuModel.getAllMenus();
    res.json(menus);
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    res.status(500).json({ error: '메뉴 조회 중 오류가 발생했습니다.' });
  }
};

/**
 * 재고 현황 조회
 */
export const getStock = async (req, res) => {
  try {
    const stock = await menuModel.getAllStock();
    res.json(stock);
  } catch (error) {
    console.error('재고 조회 오류:', error);
    res.status(500).json({ error: '재고 조회 중 오류가 발생했습니다.' });
  }
};

/**
 * 재고 업데이트
 */
export const updateStock = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: '유효하지 않은 재고 수량입니다.' });
    }
    
    const updated = await menuModel.updateStock(parseInt(menuId), stock);
    
    if (!updated) {
      return res.status(404).json({ error: '메뉴를 찾을 수 없습니다.' });
    }
    
    res.json({
      menuId: updated.id,
      menuName: updated.name,
      stock: updated.stock
    });
  } catch (error) {
    console.error('재고 업데이트 오류:', error);
    res.status(500).json({ error: '재고 업데이트 중 오류가 발생했습니다.' });
  }
};

