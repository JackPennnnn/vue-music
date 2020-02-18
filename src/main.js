import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import 'vant/lib/index.css'
import 'babel-polyfill' //辅助es6编译
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false
import fastClick from 'fastclick'
import 'common/stylus/index.styl'
Vue.prototype.$bus = new Vue();//事件总线
fastClick.attach(document.body)

Vue.use(vant)
Vue.use(VueLazyLoad,{
  loading:require('./common/image/20170702074532_Esn2G.jpeg')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
