import Vue from 'vue'
import App from './App'
import DataTablee from '../src'
import '../dist/vue-data-tablee.css'

Vue.use(DataTablee, { name: 'DataTable' })

global.vue = new Vue({
  el: '#app',
  render: h => h(App)
})
