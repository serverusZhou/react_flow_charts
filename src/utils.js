
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

function drawImage (src) {
  const image = new Image()
  image.src = src
  return image
}

export default {
  getAllItems,
  drawImage,
  checkIsBelongPosition
}
