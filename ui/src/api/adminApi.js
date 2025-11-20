import API_BASE_URL from './config.js';

/**
 * 대시보드 통계 조회
 */
export const getDashboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
    if (!response.ok) {
      throw new Error('대시보드 통계 조회에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    throw error;
  }
};

/**
 * 재고 현황 조회
 */
export const getStock = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stock`);
    if (!response.ok) {
      throw new Error('재고 조회에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('재고 조회 오류:', error);
    throw error;
  }
};

/**
 * 재고 업데이트
 */
export const updateStock = async (menuId, stock) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stock/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '재고 업데이트에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('재고 업데이트 오류:', error);
    throw error;
  }
};

/**
 * 주문 목록 조회
 */
export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders`);
    if (!response.ok) {
      throw new Error('주문 목록 조회에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    throw error;
  }
};

/**
 * 주문 상태 업데이트
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '주문 상태 업데이트에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    throw error;
  }
};

/**
 * 주문 취소
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '주문 취소에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('주문 취소 오류:', error);
    throw error;
  }
};

/**
 * 당일 총 매출액 조회
 */
export const getTodayRevenue = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/revenue/today`);
    if (!response.ok) {
      throw new Error('당일 매출액 조회에 실패했습니다.');
    }
    const data = await response.json();
    return data.todayRevenue;
  } catch (error) {
    console.error('당일 매출액 조회 오류:', error);
    throw error;
  }
};

