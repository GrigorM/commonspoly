import Vue from 'vue'
import App from './App.vue'
import store from './store'
import style from './styles/marx.min.css'
import cssVariables from './styles/variables.css'
import router from './router'

Vue.config.productionTip = false
Vue.use(style)
Vue.use(cssVariables)

export const bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
