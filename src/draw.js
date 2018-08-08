
function drawChooseWapper(cxt, position, size) {
  cxt.beginPath()
  cxt.lineWidth = '4'
  cxt.strokeStyle = 'green'
  cxt.rect(position.x, position.y, size.width, size.height)
  cxt.stroke()
}

function drawHoverWapper(cxt, position, size) {
  cxt.beginPath()
  cxt.lineWidth = '4'
  cxt.strokeStyle = 'rgba(0,0,0,.2)'
  cxt.rect(position.x, position.y, size.width, size.height)
  cxt.stroke()
}

export default function(cxt, config, items, choosenObj, hoverObj) {
  config.forEach(element => {
    const item = items[element.type]
    cxt.drawImage(item.getPic(cxt), 0, 0, 800, 622, element.position.x, element.position.y, element.size.width, element.size.height)
    if (choosenObj[element.hash]) {
      drawChooseWapper(cxt, element.position, element.size)
    }
    if (hoverObj[element.hash]) {
      drawHoverWapper(cxt, element.position, element.size)
    }
  })
}
