import Vue from 'vue'
import App from './App'
import DataTablee from '../src/DataTable.vue'

Vue.use(DataTablee, { name: 'c-table' })

global.vue = new Vue({
  el: '#app',
  render: h => h(App)
})
