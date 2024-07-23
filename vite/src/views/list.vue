<template>
  <div>

    <el-form ref="queryRef" :model="queryForm" inline label-width="100px">
                 <el-row>
                     <el-col :xl="25" :lg="6" :md="8" :sm="12">
                         <el-form-item label="名称" prop="name">
                            <el-input v-model="queryForm.name" />
                         </el-form-item>
                     </el-col> 
                     <el-col :xl="25" :lg="6" :md="8" :sm="12">
                         <div class="searchOpreaBox">
                             <el-button type="primary" @click="handleQuery">搜索</el-button>
                             <el-button @click="resetQuery">重置</el-button>
                         </div>
                     </el-col>
                 </el-row>
                 <el-row :gutter="10" class="mb8">
                     <el-col :span="1.5">
                         <el-button type="primary" @click="handleAdd">新增</el-button>
                     </el-col> 
                     <el-col :span="1.5">
                         <el-button type="danger" plain :disabled="!multiple" @click="handleDelete">删除</el-button>
                     </el-col>
                 </el-row>
             </el-form> 
             <el-row class="">
                 <el-col>
                     <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
                         <el-table-column type="selection" width="50" align="center"> </el-table-column>
                         <el-table-column label="姓名" align="center" prop="name"></el-table-column>
                         <el-table-column label="年龄" align="center" prop="age"></el-table-column>
                     </el-table>
                 </el-col>
             </el-row>
             <Pagination :pagination="pagination" />
     <el-dialog title="新增/修改" v-model="open" width="500px" :close-on-click-modal="false">
         <el-form v-loading="postLoading" ref="postRef" :model="postForm" :rules="postRules" label-width="80px">
             <el-row>
                 <el-col>
                     <el-form-item label="姓名" prop="name">
                         <el-input v-model="postForm.name" />
                     </el-form-item>
                 </el-col> 
                 <el-col>
                     <el-form-item label="年龄" prop="range"> 
                            <el-input v-model="postForm.age" />
                     </el-form-item>
                 </el-col> 
             </el-row>
         </el-form> 
         <template #footer>
             <div class="dialog-footer">
                 <el-button type="primary" @click="submitForm">提交</el-button>
                 <el-button @click="cancelForm">取 消</el-button>
             </div>
         </template>
     </el-dialog>
  </div>
</template>
<script setup lang="ts">
//列表查询
import { reactive, toRefs ,onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import useList from '@/utils/list.ts' 
import Pagination from '@/components/Pagination.vue'; 
import {cloneDeep} from 'lodash'  
import api from '@/api/test' 
onMounted(() => { 
    handleQuery(); 
})

const state = reactive({   
  queryForm: {
                    
    },
    loading: false,
    postLoading: false, 
    tableData: [],
    postForm: {
        name: "",
        age: 0,
    },
    postRules: {
        name: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
        }], 
    },
    open: false,
    operate: 'add', // add or edit 
    queryRef: null,
    postRef: null
});
const { queryForm, loading, postLoading,  tableData, postForm, postRules, open, operate, queryRef, postRef } = toRefs(state)

const queryLisPromise = () => {
  let queryClone = {
    ...queryForm.value, 
    page: page.value.currentPage,
    per_page: page.value.pageSize,
  }
  return new Promise((resolve, reject) => {
    loading.value = true  
    api.list2(queryClone).then(res => {
      loading.value = false     
      tableData.value = cloneDeep(res.rows);   
      resolve({
        tableData: res.rows,
        total: res.total,
      });  
    })
      .catch(_ => {
        loading.value = false
        reject({
          tableData: [],
          total: 0,
        });
      })
  })
}
 
const pagination  = useList(queryLisPromise, item => item.id);  
const { handleQuery, resetPage, ids,page,multiple,handleSelectionChange } = pagination; 

const resetQuery = () => {
  queryRef.value!.resetFields();
  resetPage()
  handleQuery();
};  
const handleAdd = () => {
  if (postRef.value) {
    postRef.value.resetFields();
  }
  operate.value = 'add'
  open.value = true;
}; 
const handleDelete = () => { 
  //开始删除
    ElMessage.success(`删除成功${ids.value}`)
};
const submitForm = () => {
  postRef.value.validate((baseValid) => {
    //开始提交
    ElMessage.success("提交成功")
  })
};
const cancelForm = () => {
  postLoading.value = false
  open.value = false;
}
</script>
<style lang="scss">  
</style>