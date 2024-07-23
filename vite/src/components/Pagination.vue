<template>
    <el-pagination background layout="total,sizes,->,prev, pager, next" :current-page="page.currentPage" :page-sizes="page.pageSizes"  :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
</template>

<script setup lang="tsx">
interface Props { 
    pagination: any; 
}
const props = defineProps<Props>(); 
const {page,handleSizeChange,handleCurrentChange} = props.pagination 
</script>