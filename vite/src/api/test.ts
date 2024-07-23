import request from '../utils/request'  
// 列表
const list = (params: any) => {  
    return request.get<any>('/xxxx/list', params); //这里秀嘎实际请求接口
} 
// 列表
const list2 = (params: any) => {  
    return new Promise((resolve) => {
        let res = {
            rows:[
                {id:1 , name:'张三1',age:16},
                {id:2 , name:'张三2',age:20},
                {id:3 , name:'张三3',age:16},
                {id:4 , name:'张三4',age:20},
                {id:5 , name:'张三5',age:20},
                {id:6 , name:'张三6',age:16},
                {id:7 , name:'张三7',age:20},
                {id:8 , name:'张三8',age:16},
                {id:9 , name:'张三9',age:16},
                {id:10 , name:'张三10',age:21}, 
            ],
            total: 11
        }  
        resolve(
            res
        )
    })
} 
export default {
    list,list2
}