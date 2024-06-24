import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' 
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers' 
import cdnImport from 'vite-plugin-cdn-import';
import syncToPhp from './plugins/syncToPhp';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
  }), Components({
      resolvers: [ElementPlusResolver()],
  }),

  // 添加其他库的 CDN 配置
  cdnImport({
    prodUrl: "https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}",
    modules: [
      {
        name: 'vue',
        var: 'Vue',
        path: 'vue.global.prod.min.js',
      },
      {
        name: "axios",
        var: "axios",
        path: "axios.min.js"
      }, 
      {
        name: "element-plus",
        var: "ElementPlus",
        path: "index.full.min.js",
        css: "index.min.css"
      },
    ],
  }),
  syncToPhp(),
  ], 
  build: { 
    rollupOptions: {
      input: { 
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'), 
      }
    },
  }
})
