// import axios from "axios";

// const MyHttpinterceptor = {};
// MyHttpinterceptor.install = (Vue) => {
//   axios.interceptors.request.use(config => {
//     // 获取存在本地的token
//     let token = sessionStorage.getItem('token');
//     // 如果token存在那么就把token存到headers里
//     if (token) {
//       config.headers.Authorization = token
//     }
//     return config
//   });
//   axios.interceptors.response.use(response => {
//     if (response.status === 200) {
//       return Promise.resolve(response)
//     }
//   }, (err) => {
//     if (err.response.status === 403) {
//       localStorage.removeItem('token')
//       location.href = '/#/login/'
//     }
//   })
// };
// export default MyHttpinterceptor

import axios from 'axios'
// import Vue from 'vue'
import router from '@/router'
import { Message } from 'ant-design-vue' // 引用element-ui的加载和消息提示组件

const $axios = axios.create({
  // 设置超时时间
  timeout: 30000,
  baseURL: 'http://127.0.0.1:8080/api/v1'
  // 基础url，会在请求url中自动添加前置链接
  // baseURL:  process.env.API_HOST + 'v1'
})
// Vue.prototype.$http = axios // 这里并发请求以便在组件使用this.$http.all()，具体看dashborad页面

// 在全局请求和响应拦截器中添加请求状态
// let loading = null

/**
 * 请求拦截器
 * 用于处理请求前添加loading、判断是否已保存token，并在每次请求头部添加token
 */
$axios.interceptors.request.use(
  config => {
    // loading = Spin.service({ text: '拼命加载中' })
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token // 请求头部添加token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
/**
 * 响应拦截器
 * 用于处理loading状态关闭、请求成功回调、响应错误处理
 */
$axios.interceptors.response.use(
  response => {
    // if (loading) {
    //   loading.close()
    // }
    const code = response.status
    // 请求成功返回response.data
    if ((code >= 200 && code < 300) || code === 304) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    // if (loading) {
    //   loading.close()
    // }
    console.log(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回401 清除token信息并跳转到登陆页面
          console.log(error.response.status)
          Message.error('登陆信息失效,请重新登陆')
          sessionStorage.removeItem('token')
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case 404:
          Message.error('网络请求不存在')
          break
        default:
          // Message.error(error.response.data.message || error.response.data[0])
          console.log(error.response.data.message)
      }
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes('timeout')) {
        Message.error('请求超时！请检查网络是否正常')
      } else {
        Message.error('请求失败，请检查网络是否已连接')
      }
    }
    return Promise.reject(error)
  }
)

export default $axios
