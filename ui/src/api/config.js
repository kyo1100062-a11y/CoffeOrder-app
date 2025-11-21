// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 디버깅: 환경 변수 확인 (프로덕션에서는 제거 가능)
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', API_BASE_URL);
  console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
}

export default API_BASE_URL;

