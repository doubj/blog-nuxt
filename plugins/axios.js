import { Message } from 'element-ui'
const baseURL = 'http://localhost:8088/'
export default function ({ $axios, redirect }) {
  $axios.onResponse(response => {
    const { code, msg } = response.data
    if (code !== 200) {
      Message({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      // 这里如果返回response.data.data, 调用方接受到的就是response.data.data.data了undefined，所以返回response.data即可
      return response.data
    }
  })
  $axios.onError(error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
  })
  $axios.setBaseURL(baseURL)
}