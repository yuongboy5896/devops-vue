import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './assets/css/main.css'
import axios from 'axios'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://192.168.2.61:8090'
//axios.defaults.baseURL = 'http://192.168.1.76:8090'
axios.interceptors.request.use( config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
 })
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
