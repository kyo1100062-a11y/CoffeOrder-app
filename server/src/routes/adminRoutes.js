import express from 'express';
import * as adminController from '../controllers/adminController.js';
import * as menuController from '../controllers/menuController.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// GET /api/admin/dashboard - 대시보드 통계
router.get('/dashboard', adminController.getDashboard);

// GET /api/admin/revenue/today - 당일 총 매출액
router.get('/revenue/today', adminController.getTodayRevenue);

// GET /api/admin/stock - 재고 현황
router.get('/stock', menuController.getStock);

// PUT /api/admin/stock/:menuId - 재고 업데이트
router.put('/stock/:menuId', menuController.updateStock);

// GET /api/admin/orders - 주문 목록
router.get('/orders', orderController.getAllOrders);

// PUT /api/admin/orders/:orderId/status - 주문 상태 업데이트
router.put('/orders/:orderId/status', orderController.updateOrderStatus);

// DELETE /api/admin/orders/:orderId - 주문 취소
router.delete('/orders/:orderId', orderController.deleteOrder);

export default router;

