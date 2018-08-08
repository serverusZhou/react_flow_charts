export default function(cxt, config, items, choosenObj, hoverObj) {
  config.forEach(element => {
    const item = items[element.type]
    cxt.drawImage(item.getPic(cxt), 0, 0, 800, 622, element.position.x, element.position.y, element.size.width, element.size.height)
    if (choosenObj[element.hash]) {
      cxt.beginPath()
      cxt.lineWidth = '4'
      cxt.strokeStyle = 'green'
      cxt.rect(element.position.x, element.position.y, element.size.width, element.size.height)
      cxt.stroke()
    }
    if (hoverObj[element.hash]) {
      cxt.beginPath()
      cxt.lineWidth = '4'
      cxt.strokeStyle = 'rgba(0,0,0,.2)'
      cxt.rect(element.position.x, element.position.y, element.size.width, element.size.height)
      cxt.stroke()
    }
  })
}
