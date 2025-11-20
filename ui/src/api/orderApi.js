import API_BASE_URL from './config.js';

/**
 * 주문 생성
 */
export const createOrder = async (items) => {
  try {
    // 프런트엔드 데이터 형식을 백엔드 형식으로 변환
    const orderItems = items.map(item => ({
      menuId: item.menuId,
      quantity: item.quantity,
      selectedOptionIds: item.selectedOptions.map(opt => opt.id)
    }));

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: orderItems }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '주문 생성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('주문 생성 오류:', error);
    throw error;
  }
};

