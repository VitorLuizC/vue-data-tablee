const { name } = require('./package')

module.exports = {
  name,
  banner: true,
  format: ['umd', 'umd-min', 'cjs', 'es'],
  plugins: ['vue'],
  vue: {
    css: `dist/vue-data-tablee.css`
  }
}
