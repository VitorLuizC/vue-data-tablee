import DataTablee from './components/DataTablee.vue'

/**
 * Install DataTablee components.
 * @param {Vue} Vue
 * @param {{ name: string }} [options]
 */
export const install = (Vue) => {
  Vue.component('DataTablee', DataTablee)
}

export { DataTablee }

export default install
