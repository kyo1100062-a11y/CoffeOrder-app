// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 환경 변수 확인 로그
// 개발 환경과 프로덕션 빌드 시 모두 표시
console.log('🔧 환경 모드:', import.meta.env.MODE);
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || '(설정 안됨)');

// 프로덕션 빌드 시 환경 변수 확인
if (import.meta.env.MODE === 'production') {
  console.log('✅ Production API Base URL:', import.meta.env.VITE_API_BASE_URL);
  if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('⚠️  경고: 프로덕션 환경에서 VITE_API_BASE_URL이 설정되지 않았습니다!');
  }
}

export default API_BASE_URL;

