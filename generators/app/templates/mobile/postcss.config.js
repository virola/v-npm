module.exports = {
  plugins: {
    // to edit target browsers: use "browserslist" field in package.json
    autoprefixer: {},
    // 配置ui框架的尺寸
    'postcss-pxtorem': {
      rootValue: 37.5, // 这里是数字是按照设计图的尺寸来的，例如设计图尺寸是750的，那这里的值就是750/10
      propList: ['*'],
      selectorBlackList: ['van', 'solid'] // 因为vant-ui 用的rem的尺寸是375的，所以这里要把他过滤掉。
    }
  }
}
