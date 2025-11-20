import * as orderModel from '../models/orderModel.js';

/**
 * 대시보드 통계 조회
 */
export const getDashboard = async (req, res) => {
  try {
    const stats = await orderModel.getOrderStats();
    res.json(stats);
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({ error: '대시보드 통계 조회 중 오류가 발생했습니다.' });
  }
};

/**
 * 당일 총 매출액 조회
 */
export const getTodayRevenue = async (req, res) => {
  try {
    const revenue = await orderModel.getTodayRevenue();
    res.json({ todayRevenue: revenue });
  } catch (error) {
    console.error('당일 매출액 조회 오류:', error);
    res.status(500).json({ error: '당일 매출액 조회 중 오류가 발생했습니다.' });
  }
};

