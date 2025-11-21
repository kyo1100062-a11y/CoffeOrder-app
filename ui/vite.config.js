import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 빌드 최적화 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 프로덕션에서는 소스맵 비활성화 (선택사항)
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 1000,
  },
  // 정적 파일 서빙 설정
  publicDir: 'public',
})

