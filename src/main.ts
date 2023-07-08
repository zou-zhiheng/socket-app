import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index'
import { Icon, Field, CellGroup, Button, Popup, Tabbar, TabbarItem,Picker } from 'vant';
import * as echarts from 'echarts';
import axios from 'axios'
import 'vant/lib/index.css';
import { ConfigProvider } from 'vant';
const app = createApp(App);
app.config.globalProperties.$axios = axios
app.config.globalProperties.$echarts = echarts
app.use(router)
let arr = [Icon, Field, CellGroup, Button, Popup, Tabbar, Picker,TabbarItem,ConfigProvider];
arr.forEach((item:any) => {
    app.use(item)
})
app.mount('#app')


axios.interceptors.request.use(
    (config) => {
      // 设置token，Content-Type
      const token = localStorage.getItem("token");
      config.headers['token'] = token
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      // console.log(config.headers['token']);
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  