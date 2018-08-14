function keysSwith (swithObj) { // 对象key切换
  return {
    getCurrentMode: () => {
      const result = Object.keys(swithObj).find(mode => swithObj[mode])
      return result
    },
    is: (mode) => {
      return swithObj[mode]
    },
    setTo: (mode) => {
      Object.keys(swithObj).forEach(item => {
        swithObj[item] = false
      })
      swithObj[mode] = true
    }
  }
}

function clearObj (obj) {
  Object.keys(obj).forEach(key => {
    delete obj[key]
  })
}
  
export default {
  keysSwith,
  clearObj,
}
