import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders/:orderId - 주문 조회
router.get('/:orderId', orderController.getOrder);

export default router;

