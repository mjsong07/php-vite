// shims-vue.d.ts
declare module '*.vue' {
    import { defineComponent } from 'vue';
    const component: ReturnType<typeof defineComponent>;
    export default component;
  }

  declare interface Window{
    __vue__router_path: string;
  }
  
  // 引用自定义类型声明
  /// <reference path="./window.d.ts" />
  