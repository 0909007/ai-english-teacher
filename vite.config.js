import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  // 상대경로로 빌드해서 경로 문제 방지
  build: {
    outDir: 'dist',  // 빌드 산출물 폴더 지정
  },
})
