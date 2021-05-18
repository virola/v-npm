/**
 * 图表统一颜色配置
 */
export const COLORS = [
  '#30d9bb', '#2acaf3', '#ffcd3b',
  '#ff8e3b', '#4684ff', '#ce62d6',
  '#00c853', '#a7e768', '#d9d0c7',
  '#87a997', '#d49ea2', '#5b4947',
  '#7ba3a8'
]

export const GRID = {
  containLabel: true,
  top: 10,
  left: 10,
  right: 10,
  bottom: 10
}

export function random(val = 700) {
  return Math.round(300 + Math.random() * val) / 10
}

/**
 * 自定义加载样式
 */
export const loadingOptions = {
  text: 'loading',
  color: '#30d9bb',
  textColor: '#30d9bb',
  maskColor: 'rgba(255, 255, 255, 0.3)',
  zlevel: 0,

  // 字体大小。从 `v4.8.0` 开始支持。
  fontSize: 14,
  // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
  showSpinner: true,
  // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
  spinnerRadius: 10,
  // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
  lineWidth: 5,
  // 字体粗细。从 `v5.0.1` 开始支持。
  fontWeight: 'normal',
  // 字体风格。从 `v5.0.1` 开始支持。
  fontStyle: 'normal',
  // 字体系列。从 `v5.0.1` 开始支持。
  fontFamily: 'sans-serif'
}

export const itemPoint = (color) => {
  return [
    '<span style="',
    `background-color:${color};`,
    'display: inline-block;',
    'width: 10px;',
    'height: 10px;',
    'border-radius: 50%;',
    'margin-right:2px;',
    '"></span>'
  ].join('')
}
