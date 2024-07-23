import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage,ElLoading } from 'element-plus'
import {blobValidate,tansParams} from '@/utils/index'
import { saveAs } from 'file-saver'
import errorCode from '@/utils/errorCode'
// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
    code: number;
    msg: string
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
    data?: T;
}
let URL: string = import.meta.env.VITE_AXIOS_BASE_URL as string;

enum RequestEnums {
    TIMEOUT = 120000, // 两分钟
    OVERDUE = 600, // 登录失效
    FAIL = 999, // 请求失败
    SUCCESS = 200, // 请求成功
}
const config = {
    // 默认地址
    baseURL: URL as string,
    // 设置超时时间
    timeout: RequestEnums.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
}

class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance; 
    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config); 
        /**
         * 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
         */
        this.service.interceptors.request.use(
            (config) => { 
                config.withCredentials = true;
                return {
                    ...config,
                    // headers: {
                    //     'x-access-token': token, // 请求头中携带token信息
                    // }
                }
            },
            (error: AxiosError) => {
                // 请求报错
                Promise.reject(error)
            }
        )

        /**
         * 响应拦截器
         * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => { 
                const { data, config } = response; // 解构
                if (data.code === RequestEnums.OVERDUE) {
                    // 登录信息失效，应跳转到登录页面，并清空本地的token
                    localStorage.setItem('token', '');
                    // router.replace({
                    //   path: '/login'
                    // })
                    return Promise.reject(data);
                }
                // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
                if (data.code && data.code === RequestEnums.SUCCESS) {
                   return data
                } else {
                    if(!data.code) {
                        ElMessage.error('接口请求异常,请联系管理员'); // 此处也可以使用组件提示报错信息
                        return Promise.reject('接口请求异常,请联系管理员')
                    } 
                }
                ElMessage.error(data.msg); // 此处也可以使用组件提示报错信息
                return Promise.reject(data) 
            },
            (error: AxiosError) => { 
                const { response } = error;
                if(error && error.code === "ECONNABORTED") {
                    ElMessage.error('请求超时');
                    return Promise.reject('请求超时');
                }
               
                if (response) {
                    this.handleCode(response.status)
                }
                if (!window.navigator.onLine) {
                    ElMessage.error('网络连接失败');
                    // 可以跳转到错误页面，也可以不做操作
                    // return router.replace({
                    //   path: '/404' 
                    // });
                }
            }
        )
    }
    handleCode(code: number): void {
        switch (code) {
            case 401:
                ElMessage.error('登录失败，请重新登录');
                break;
            default:
                ElMessage.error('请求失败');
                break;
        }
    }

    // 常用方法封装
    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, { params });
    }
    post<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, params);
    }
    put<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.put(url, params);
    }
    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.delete(url, { params });
    }
     
    //下载文件，这里不要是自定义的this.service 请求，会有很多多余的配置
    async downloadFile(url:string, params:object, inputFileName?:string, config?:any) {
        try {
          const res = await axios.get(url, {
            params, 
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/octet-stream'
              }
            }); 
            const { data } = res
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) 
            let responseHeaderName = '' 
            if(res.headers && res.headers['content-disposition']) { 
                const disposition = decodeURI(res.headers['content-disposition'])
                responseHeaderName = disposition.substring(disposition.indexOf('filename=') + 9, disposition.length)
            } else {
                responseHeaderName = 'export.xlsx'
            }
            if ('download' in document.createElement('a')) {
                // 非IE下载
                const elink = document.createElement('a')
                elink.download = inputFileName ? inputFileName : responseHeaderName
                elink.style.display = 'none'
                elink.href = window.URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                window.URL.revokeObjectURL(elink.href)
                document.body.removeChild(elink)
            } else {
                // IE10+下载
                window.navigator.msSaveBlob(blob, responseHeaderName)
            }  
        } catch (error) {
          console.error('下载文件时出错：', error);
        }
      }


     parseFilenameFromContentDisposition(contentDisposition:string) {
        // 正则表达式匹配 filename*=utf-8'' 或 filename*=UTF-8''
        const filenameRegex = /filename[*]?=[^;=\n]*?[^;=\n]*?['"]?([^'";]+)['"]?/;
        const matches = contentDisposition.match(filenameRegex);
        if (matches && matches.length > 1) {
          // 返回匹配的文件名
          return decodeURIComponent(matches[1]);
        }
        return null; // 如果没有匹配，返回null
      }
       
 
}

// 导出一个实例对象
export default new RequestHttp(config);
