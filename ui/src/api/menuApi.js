import API_BASE_URL from './config.js';

/**
 * 메뉴 목록 조회
 */
export const getMenus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`);
    if (!response.ok) {
      throw new Error('메뉴 조회에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    throw error;
  }
};

