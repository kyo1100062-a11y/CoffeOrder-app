import * as orderModel from '../models/orderModel.js';
import * as menuModel from '../models/menuModel.js';

/**
 * 주문 생성
 */
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: '주문 항목이 필요합니다.' });
    }
    
    // 총액 계산
    let totalPrice = 0;
    for (const item of items) {
      if (!item.menuId || !item.quantity) {
        return res.status(400).json({ error: '주문 항목 정보가 올바르지 않습니다.' });
      }
      
      // 메뉴 가격 조회
      const menu = await menuModel.getMenuById(item.menuId);
      if (!menu) {
        return res.status(404).json({ error: `메뉴 ID ${item.menuId}를 찾을 수 없습니다.` });
      }
      
      // 옵션 가격 계산
      let optionPrice = 0;
      if (item.selectedOptionIds && item.selectedOptionIds.length > 0) {
        const optionPrices = menu.options
          .filter(opt => item.selectedOptionIds.includes(opt.id))
          .map(opt => opt.price);
        optionPrice = optionPrices.reduce((sum, price) => sum + price, 0);
      }
      
      totalPrice += (menu.price + optionPrice) * item.quantity;
    }
    
    // 주문 생성
    const order = await orderModel.createOrder(items, totalPrice);
    
    res.status(201).json(order);
  } catch (error) {
    console.error('주문 생성 오류:', error);
    res.status(500).json({ error: error.message || '주문 생성 중 오류가 발생했습니다.' });
  }
};

/**
 * 주문 조회
 */
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.getOrderById(parseInt(orderId));
    
    if (!order) {
      return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({ error: '주문 조회 중 오류가 발생했습니다.' });
  }
};

/**
 * 모든 주문 조회
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({ error: '주문 목록 조회 중 오류가 발생했습니다.' });
  }
};

/**
 * 주문 상태 업데이트
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['주문 접수', '제조 중', '제조 완료'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: '유효하지 않은 주문 상태입니다.' });
    }
    
    const order = await orderModel.updateOrderStatus(parseInt(orderId), status);
    
    if (!order) {
      return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    const statusCode = error.message.includes('재고') ? 400 : 500;
    res.status(statusCode).json({ error: error.message || '주문 상태 업데이트 중 오류가 발생했습니다.' });
  }
};

/**
 * 주문 삭제 (취소)
 */
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    await orderModel.deleteOrder(parseInt(orderId));
    
    res.json({ message: '주문이 취소되었습니다.' });
  } catch (error) {
    console.error('주문 삭제 오류:', error);
    res.status(500).json({ error: error.message || '주문 삭제 중 오류가 발생했습니다.' });
  }
};

