<script setup lang="ts"> 
import { zhCn } from "element-plus/es/locale/index.mjs";
import {  onMounted } from "vue";
import {  useRouter } from 'vue-router';

const router = useRouter();
onMounted(() => {
    console.log("window.__vue__router_path",window.__vue__router_path)
    if(window.__vue__router_path) {
        router.push(`/${window.__vue__router_path}`);
    }
})
</script>
<template>

  <el-config-provider :locale="zhCn">
    <router-view></router-view> 
  </el-config-provider>
  
</template> 

<style scoped lang="scss"> 
 
</style>
