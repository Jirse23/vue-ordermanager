import Vue from 'vue'
import App from './App.vue'
import router from './router'
//可以在这里引入全局样式
import ElementUI from 'element-ui'

Vue.use(ElementUI)

// 引入element ui 的全局样式
import 'element-ui/lib/theme-chalk/index.css'

// 1.创建一个全局的bus样式
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
