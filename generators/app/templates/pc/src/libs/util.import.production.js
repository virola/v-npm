// module.exports = file => () => import('@/views/' + file)
module.exports = file => require('@/views/' + file).default
