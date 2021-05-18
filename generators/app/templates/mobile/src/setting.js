/**
 * 基础配置文件
 */
 const actTypeMap = {
  1: '小型活动',
  2: '科室活动',
  3: '全院活动'
}

const actTypeList = Object.keys(actTypeMap).map(key => {
  return {
    label: actTypeMap[key],
    value: key
  }
})

export default {
  // 活动类型配置
  act: {
    type: {
      list: actTypeList,
      map: actTypeMap
    }
  },
}
