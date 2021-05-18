/**
 * node工具整理python获取的数据，格式化输出为本程序需要的数据格式。
 * 数据格式参考： data.example.json
 */

 /**
  * 中国编码
  */
const CHINA_CODE = '86'

/**
 * 截取CODE级别
 * statistical_code 是五级数据 110000000000  2位数字为一级
 * 留取3级数据时要截取6位数
 */
const LEVEL = 3

const fs = require('fs')

const provinceData = require('./province_stats.gov.cn.json')
const cityData = require('./city_stats.gov.cn.json')
const countyData = require('./county_stats.gov.cn.json')

/**
 * 输出内容
 */
const fileData = {}
fileData[CHINA_CODE] = {}

/**
 * 获取级别编码
 * @param {*} statsCode 
 */
function getCode(statsCode) {
  return statsCode.toString().substring(0, 2 * LEVEL)
}

/**
 * 输出json文件
 * @param {*} filename 导出文件
 * @param {*} data json内容
 * @param {*} format 是否格式化
 */
function exportJson(filename, data) {
  let content = JSON.stringify(data);
  let formatContent = JSON.stringify(data, null, 2);
  fs.writeFile(filename + '.json', content, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('JSON saved to: ' + filename + '.json');
    }
  });
  fs.writeFile(filename + '.format.json', formatContent, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('JSON saved to: ' + filename + '.format.json');
    }
  });
}

provinceData.forEach(item => {
  const provinceCode = getCode(item.statistical_code)
  fileData[CHINA_CODE][provinceCode] = item.name
  fileData[provinceCode] = {}
})

cityData.forEach(item => {
  const cityCode = getCode(item.statistical_code)
  const provinceCode = cityCode.substring(0, 2) + '0000'
  fileData[provinceCode][cityCode] = item.name
  fileData[cityCode] = {}
})

countyData.forEach(item => {
  // 注意这里有个问题，三级01基本上都是“市辖区”，需要从选项中去掉
  if (item.name == '市辖区') {
    return
  }
  const countyCode = getCode(item.statistical_code)
  // const provinceCode = countyCode.substring(0, 2) + '0000'
  const cityCode = countyCode.substring(0, 4) + '00'
  fileData[cityCode][countyCode] = item.name
})

// console.log(fileData)
exportJson('data', fileData)
