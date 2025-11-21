/**
 * API 연결 디버깅 유틸리티
 * 브라우저 콘솔에서 사용 가능
 */

import API_BASE_URL from '../api/config.js';

export const debugApiConnection = async () => {
  console.log('=== API 연결 디버깅 ===\n');
  
  console.log('1. 환경 변수 확인:');
  console.log('   VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || '(설정 안됨)');
  console.log('   API_BASE_URL:', API_BASE_URL);
  console.log('');
  
  console.log('2. 백엔드 연결 테스트:');
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`);
    console.log('   상태 코드:', response.status);
    console.log('   상태 텍스트:', response.statusText);
    console.log('   Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ 연결 성공!');
      console.log('   메뉴 개수:', data.length);
    } else {
      const errorText = await response.text();
      console.log('   ❌ 연결 실패:', errorText);
    }
  } catch (error) {
    console.log('   ❌ 연결 오류:', error.message);
    console.log('   오류 타입:', error.name);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('   💡 해결 방법:');
      console.log('      - 백엔드 서버가 실행 중인지 확인');
      console.log('      - API URL이 올바른지 확인');
      console.log('      - CORS 설정을 확인');
    }
  }
  
  console.log('\n=== 디버깅 완료 ===');
};

// 브라우저 콘솔에서 사용할 수 있도록 전역에 등록
if (typeof window !== 'undefined') {
  window.debugApiConnection = debugApiConnection;
}

