// import * as system from './modules/system'
// import * as reserve from './modules/reserve'
// import * as account from './modules/account'

// export default {
//   ...system,
//   ...reserve,
//   ...account
// }

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./modules', false, /\.js$/)
const apisModules = requireAll(req)

// console.log(apisModules)

let apis = {}
apisModules.forEach(mod => {
  apis = Object.assign(apis, mod)
})

/**
 * 获取 modules 下所有api接口，集合到一个对象中
 * API有重名，建议不要使用这个模块
 */
export default apis
