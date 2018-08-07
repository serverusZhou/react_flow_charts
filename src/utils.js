
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

function drawImage (src) {
  const image = new Image()
  image.src = src
  return image
}

export default {
  getAllItems,
  drawImage
}
