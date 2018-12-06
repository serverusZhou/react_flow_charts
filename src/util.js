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

function getImage(url) {
  const image = new Image()
  image.src = url
  return image
}

function getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize) {
  const from = {
    x: fromPosition.x - fromSize.width / 2,
    y: fromPosition.y - fromSize.height / 2,
  }
  const to = {
    x: toPosition.x - toSize.width / 2,
    y: toPosition.y - toSize.height / 2,
  }
  const fCCenter = {
    x: from.x + fromSize.width / 2,
    y: from.y + fromSize.height / 2
  }
  const tCCenter = {
    x: to.x + toSize.width / 2,
    y: to.y + toSize.height / 2
  }
  const returnFrom = { x: 0, y: 0 }
  // 垂直方向
  if (fCCenter.x === tCCenter.x) {
    returnFrom.x = from.x + fromSize.width / 2
    returnFrom.y = from.y + fromSize.height * (tCCenter.y < fCCenter.y ? 0 : 1)
  }
  // 右上方
  if (tCCenter.x > fCCenter.x && tCCenter.y < fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 + fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width
      returnFrom.y = from.y + fromSize.height / 2 - fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 右下方
  if (tCCenter.x > fCCenter.x && tCCenter.y > fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 + fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y + fromSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width
      returnFrom.y = from.y + fromSize.height / 2 + fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 水平方向
  if (fCCenter.y === tCCenter.y) {
    returnFrom.x = from.x + fromSize.width * (tCCenter.x > fCCenter.x ? 1 : 0)
    returnFrom.y = from.y + fromSize.height / 2
  }
  // 左上方
  if (tCCenter.x < fCCenter.x && tCCenter.y < fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 - fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x
      returnFrom.y = from.y + fromSize.height / 2 - fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 左下方
  if (tCCenter.x < fCCenter.x && tCCenter.y > fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 - fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y + fromSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x
      returnFrom.y = from.y + fromSize.height / 2 + fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  const returnTo = { x: 0, y: 0 }
  // 垂直方向
  if (tCCenter.x === fCCenter.x) {
    returnTo.x = to.x + toSize.width / 2
    returnTo.y = to.y + toSize.height * (fCCenter.y > tCCenter.y ? 1 : 0)
  }
  // 右上方
  if (fCCenter.x > tCCenter.x && fCCenter.y < tCCenter.y) {
    if (Math.abs((fCCenter.y - tCCenter.y) / (fCCenter.x - tCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 + toSize.height / 2 * Math.abs((fCCenter.x - tCCenter.x) / (fCCenter.y - tCCenter.y))
      returnTo.y = to.y
    }
    if (Math.abs((fCCenter.y - tCCenter.y) / (fCCenter.x - tCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width
      returnTo.y = to.y + toSize.height / 2 - toSize.width / 2 * Math.abs((fCCenter.y - tCCenter.y) / (fCCenter.x - tCCenter.x))
    }
  }
  // 右下方
  if (fCCenter.x > tCCenter.x && fCCenter.y > tCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 + toSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnTo.y = to.y + toSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width
      returnTo.y = to.y + toSize.height / 2 + toSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 水平方向
  if (fCCenter.y === tCCenter.y) {
    returnTo.x = to.x + toSize.width * (fCCenter.x > tCCenter.x ? 1 : 0)
    returnTo.y = to.y + toSize.height / 2
  }
  // 左上方
  if (fCCenter.x < tCCenter.x && fCCenter.y < tCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 - toSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnTo.y = to.y
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x
      returnTo.y = to.y + toSize.height / 2 - toSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 左下方
  if (fCCenter.x < tCCenter.x && fCCenter.y > tCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 - toSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnTo.y = to.y + toSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x
      returnTo.y = to.y + toSize.height / 2 + toSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  return {
    from: returnFrom,
    to: returnTo
  }
}

function getLinePositionWithoutAssemblyBySide(fromPosition, toPosition, fromSize, toSize) {
  let from = {
    x: fromPosition.x + fromSize.width / 2,
    y: fromPosition.y + fromSize.height / 2,
  }
  let to = {
    x: toPosition.x + toSize.width / 2,
    y: toPosition.y + toSize.height / 2,
  }
  if (fromSize.width * fromSize.height < 25 && toSize.width * toSize.height > 25) {
    to = getRelativePosition({
      x: toPosition.x - toSize.width / 2,
      y: toPosition.y - toSize.height / 2
    }, toSize, {
      x: fromPosition.x - fromSize.width / 2,
      y: fromPosition.y - fromSize.height / 2
    })
  }
  if (fromSize.width * fromSize.height > 25 && toSize.width * toSize.height < 25) {
    from = getRelativePosition({
      x: fromPosition.x - fromSize.width / 2,
      y: fromPosition.y - fromSize.height / 2
    }, fromSize, {
      x: toPosition.x + toSize.width / 2,
      y: toPosition.y + toSize.height / 2
    })
  }
  if (fromSize.width * fromSize.height > 25 && toSize.width * toSize.height > 25) {
    return getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize)
  }
  // console.log('fromPosition', fromPosition, 'toPosition', toPosition, 'fromSize', fromSize, 'toSize', toSize)
  // console.log('return', {
  //   from,
  //   to
  // })
  return {
    from,
    to
  }
}

function getRelativePosition(objectPosition, objectSize, pointPosition) {
  // console.log('objectPosition', objectPosition, 'objectSize', objectSize, 'pointPosition', pointPosition)
  let returnPosition = {
    x: 0,
    y: 0
  }
  // 正上或者正下
  if (pointPosition.x >= objectPosition.x && pointPosition.x <= (objectPosition.x + objectSize.width)) {
    // console.log('正上或者正下')
    returnPosition.x = pointPosition.x
    // 中心点往上
    if (pointPosition.y <= (objectPosition.y + objectSize.height / 2)) {
      returnPosition.y = objectPosition.y
    }
    // 中心点往下
    if (pointPosition.y >= (objectPosition.y + objectSize.height / 2)) {
      returnPosition.y = objectPosition.y + objectSize.height
    }
  }
  // 正左或者正右
  if (pointPosition.y >= objectPosition.y && pointPosition.y <= (objectPosition.y + objectSize.height)) {
    // console.log('正左或者正右')
    returnPosition.y = pointPosition.y
    // 中心点往左
    if (pointPosition.x <= (objectPosition.x + objectSize.width / 2)) {
      returnPosition.x = objectPosition.x
    }
    // 中心点往右
    // console.log('中心点往右')
    if (pointPosition.x >= (objectPosition.x + objectSize.width / 2)) {
      returnPosition.x = objectPosition.x + objectSize.width
    }
  }
  // 左上
  if (pointPosition.x < objectPosition.x && pointPosition.y < objectPosition.y) {
    returnPosition = objectPosition
  }
  // 右上
  if (pointPosition.x > (objectPosition.x + objectSize.width) && pointPosition.y < objectPosition.y) {
    // console.log()
    returnPosition.x = objectPosition.x + objectSize.width
    returnPosition.y = objectPosition.y
  }
  // 左下
  if ((pointPosition.x < objectPosition.x) && pointPosition.y > (objectPosition.y + objectSize.height)) {
    returnPosition.x = objectPosition.x
    returnPosition.y = objectPosition.y + objectSize.height
  }
  // 右下
  if (pointPosition.x > (objectPosition.x + objectSize.width) && pointPosition.y > (objectPosition.y + objectSize.height)) {
    returnPosition.x = objectPosition.x + objectSize.width
    returnPosition.y = objectPosition.y + objectSize.height
  }
  return returnPosition
}
  
export default {
  keysSwith,
  clearObj,
  getImage,
  getLinePositionWithoutAssembly,
  getLinePositionWithoutAssemblyBySide
}
