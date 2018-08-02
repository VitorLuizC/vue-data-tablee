const { name } = require('./package.json')
const vue = require('rollup-plugin-vue').default
const css = require('rollup-plugin-css-only')

module.exports = {
  js: 'buble',
  input: 'src/DataTable.vue',
  banner: true,
  format: ['umd', 'umd-min', 'cjs', 'es'],
  filename: name + '[suffix].js',
  plugins: [
    css({ output: `dist/${name}.css` }),
    vue({ css: false })
  ]
}
