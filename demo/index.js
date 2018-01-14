import Vue from 'vue'
import App from './App'
import DataTablee from '../'

Vue.use(DataTablee)

global.vue = new Vue({
  el: '#app',
  render: h => h(App)
})
