import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers' 
import cdnImport from 'vite-plugin-cdn-import';
import syncToPhp from './plugins/syncToPhp';
import { isProd, loadEnv } from './src/utils/vite' 
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(({ mode, command }) => { 
   const { VITE_BASE_PATH } = loadEnv(mode)

  const pathResolve = (dir: string): any => {
    return resolve(__dirname, '.', dir)
  }
  
  const alias: Record<string, string> = {
    '@': pathResolve('./src/'),
    '~': pathResolve('./'),
    assets: pathResolve('./src/assets'), 
  }

  console.log("VITE_BASE_PATH",VITE_BASE_PATH)
  let baseUrl = VITE_BASE_PATH 

  return { 

    resolve: { alias },
    plugins: [vue(),vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
    }), Components({
        resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      mockPath: './src/mock', 
    }),
  
    // 添加其他库的 CDN 配置
    cdnImport({
      // prodUrl: "https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}", 
      modules: [
        // {
        //   name: 'vue',
        //   var: 'Vue', 
        //   path: 'vue.global.prod.min.js',
        // },
        // {
        //   name: "axios",
        //   var: "axios",
        //   path: "axios.min.js"
        // }, 
        // {
        //   name: "element-plus",
        //   var: "ElementPlus",
        //   path: "index.full.min.js",
        //   css: "index.min.css"
        // },
        {
          name: 'vue',
          var: 'Vue', 
          path: `${baseUrl}/js/plugin/vue3/vue.global.min.js`,
        },
        {
          name: "axios",
          var: "axios",
          path: `${baseUrl}/js/plugin/axios/axios.min.js`
        }, 
        {
          name: "element-plus",
          var: "ElementPlus",
          path: `${baseUrl}/js/plugin/elementplus/index.full.min.js`,
          css: `${baseUrl}/js/plugin/elementplus/index.min.css`
        },  

      ], 
    }),
    syncToPhp(),
    ],  
    base: `${baseUrl}/vite/`, 
  
      // 服务端渲染
    server: {
      // 端口号
      // port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 暂不使用
      proxy: {
        "/api": {
          target: "http://xxxxxx.cn",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        } 
      },  
    },
    build: {
      minify: false,
    },
    css: {
        // CSS 预处理器
        preprocessorOptions: {
            //define global scss variable
            scss: {
                javascriptEnabled: true,
                additionalData: `@import "src/styles/index.scss";`
            }
        }
    } 

  }
})