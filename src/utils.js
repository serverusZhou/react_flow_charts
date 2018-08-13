
function getAllItems (array) {
  const items = {}
  array.forEach(element => {
    element.icon.forEach(icon => {
      items[icon.key] = {
        ...icon
      }
    })
  })
  Object.keys(items).forEach(key => {
    if (!items[key].draw) {
      items[key].getPic = function(ctx) {
        const image = new Image()
        image.src = items[key].imgSrc
        return image
      }
    }
  })
  return items
}

function checkIsBelongPosition (point, belongPoints) {
  if (point.x > belongPoints.x && point.x < belongPoints.endX && point.y > belongPoints.y && point.y < belongPoints.endY) {
    return true
  } else {
    return false
  }
}

// from to中的坐标为中心点
function getLinePosition (from, to, fromObjSize, toObjSize) {
  let x = to.x - from.x
  let y = to.y - from.y
  let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  const fromObjLength = Math.sqrt(Math.pow(fromObjSize.width, 2) + Math.pow(fromObjSize.height, 2))
  const toObjLength = Math.sqrt(Math.pow(toObjSize.width, 2) + Math.pow(toObjSize.height, 2))
  return {
    from: {
      x: from.x + fromObjLength * x / length / 2,
      y: from.y + fromObjLength * y / length / 2,
    },
    to: {
      x: to.x - toObjLength * x / length / 2,
      y: to.y - toObjLength * y / length / 2,
    }
    // from: {
    //   x: from.x,
    //   y: from.y ,
    // },
    // to: {
    //   x: to.x,
    //   y: to.y,
    // }
  }
}

function drawImage (src) {
  const image = new Image()
  image.src = src
  return image
}

function keysSwith (swithObj) {
  return {
    getCurrentMode: () => {
      const result = Object.keys(swithObj).find(mode => swithObj[mode])
      if (result && result.length) {
        return result[0]
      } else {
        return null
      }
    },
    is: (mode) => {
      return swithObj.mode
    }
  }
}

export default {
  getAllItems,
  drawImage,
  checkIsBelongPosition,
  getLinePosition,
  keysSwith,
}
