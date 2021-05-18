import dayjs from 'dayjs'

/**
 * 列表接口数据转成表格需要的数据
 * @param {*} list
 */
export function listToTable(list = [], columns = []) {
  return list.map(item => {
    const tmp = {}
    columns.forEach(c => {
      if (!c.prop) {
        return
      }
      tmp[c.prop] = item[c.prop]
      if (item[c.prop] !== null && c.formatter) {
        try {
          switch (c.formatter) {
            case 'datetime':
              tmp[c.prop] = item[c.prop] ? dayjs(item[c.prop]).format('YYYY-MM-DD HH:mm:ss') : ''
              break
            case 'currency':
              tmp[c.prop] = (item[c.prop] / 100)
              break
            case 'dataset':
              tmp[c.prop] = c.dataset[item[c.prop]] || ''
              break
            case 'function':
              tmp[c.prop] = c.func(item) || ''
              break
            default:
              break
          }
        } catch (err) {
          // nothing
          console.log(err)
        }
      }
    })
    return tmp
  })
}
