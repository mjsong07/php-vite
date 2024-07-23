
 
import {  reactive,toRefs } from 'vue' 

export default function useList(queryLisPromise : any,handleSelectionChangeFun: any) {
  const state = reactive({
      page: {
          currentPage: 1, //服务端参数 当前几页
          pageSize: 10, //服务端参数 一页多少条
          total: 0, //服务端参数 一共有多少条
          pageSizes: [10, 20, 30, 50], //每页显示个数选择器的选项设置 客户端参数
          pagerCount: 6,  //最大页码按钮数 客户端参数
      }, 
      //恢复默认设置 使用
      pageBase: {  },  
      ids: true,
      single: false,
      multiple: false
  }) ;
  state.pageBase = {...state.page} //复制一份
  const funObj = {
    async handleQuery() {
      let tableData = []
      let total = 0
      try {
        let obj =  await queryLisPromise()
        tableData = obj.tableData
        total = obj.total 
      } catch (error) {
        console.warn("分页请求异常",error)
      } 
      state.page.total = total; 
      state.single = false
      state.multiple = false
      return tableData
    },
    handleSizeChange(val) {
        state.page.pageSize = val
        if (state.page.currentPage * val > state.page.total) {
          state.page.currentPage = 1
        }
        funObj.handleQuery();
    },
    handleCurrentChange(val) {
        state.page.currentPage = val
        funObj.handleQuery();
    },
    resetPage() {
      state.page = {...state.pageBase} 
    },
    handleSelectionChange(selection) {
      state.ids = selection.map(handleSelectionChangeFun); //item => item.id
      state.single = selection.length === 1;
      state.multiple = !!selection.length;
    }, 
  }

  return {...toRefs(state)
    ,...funObj 
  };
}