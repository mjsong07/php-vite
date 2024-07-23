<template>
  <div> 
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
<script setup lang="ts">
//列表查询
import { ref} from 'vue'
const count = ref(0);
const increment = () => {
  count.value++;
}; 
</script>
<style lang="scss">  
</style>