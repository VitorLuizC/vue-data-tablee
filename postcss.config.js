module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-nested': {},
    'autoprefixer': {
      browsers: ['ie > 10', 'last 2 versions']
    }
  }
}
