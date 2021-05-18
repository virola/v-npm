const _version = process.env.VUE_APP_VERSION
const _prefix = `m_${_version}_`

export default {
  get (key) {
    const value = localStorage.getItem(_prefix + key)
    let result = value
    try {
      if (value && (value.indexOf('{') > -1 || value.indexOf('[') > -1)) {
        result = JSON.parse(value)
      }
    } catch (err) {
      console.warn(err)
    }
    return result || ''
  },

  set (key, value) {
    let result = value
    if (typeof value == 'object') {
      result = JSON.stringify(value)
    }
    localStorage.setItem(_prefix + key, result)
  },

  remove (key) {
    localStorage.removeItem(_prefix + key)
  }
}
