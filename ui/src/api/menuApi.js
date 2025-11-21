import API_BASE_URL from './config.js';

/**
 * 메뉴 목록 조회
 */
export const getMenus = async () => {
  const url = `${API_BASE_URL}/api/menus`;
  console.log('📡 메뉴 API 호출:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 API 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 오류 응답:', errorText);
      throw new Error(`메뉴 조회에 실패했습니다. (${response.status}: ${response.statusText})`);
    }
    
    const data = await response.json();
    console.log('✅ 메뉴 데이터 수신:', data.length, '개');
    return data;
  } catch (error) {
    console.error('❌ 메뉴 조회 오류:', error);
    console.error('   API URL:', url);
    console.error('   오류 타입:', error.name);
    console.error('   오류 메시지:', error.message);
    
    // 네트워크 오류인 경우 더 자세한 정보 제공
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`서버에 연결할 수 없습니다. API URL을 확인하세요: ${API_BASE_URL}`);
    }
    
    throw error;
  }
};

