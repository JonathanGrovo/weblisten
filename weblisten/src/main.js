import Vue from 'vue'
import router from './router'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(router);

new Vue({
  router, // include router in Vue instance
  render: h => h(App),
}).$mount('#app')
