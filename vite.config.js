/**
 * Vite配置文件
 * 配置静态资源处理和构建选项
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // 插件
  plugins: [vue()],

  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保静态资源正确处理
    assetsInlineLimit: 4096, // 4kb以下的静态资源将被内联为base64
    minify: 'terser'
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // 公共基础路径
  base: '/',
  
  // 配置资源处理
  publicDir: 'public'
}); 