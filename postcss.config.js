module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-nested': {},
    'postcss-css-variables': {
      preserve: true
    },
    'autoprefixer': {
      browsers: ['ie > 10', 'last 2 versions']
    }
  }
}
