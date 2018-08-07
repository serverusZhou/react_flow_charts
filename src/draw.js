export default function(cxt, config, items) {
  config.forEach(element => {
    const item = items[element.type]
    cxt.drawImage(item.getPic(cxt), 0, 0, 800, 800, element.position.x, element.position.y, element.size.width, element.size.height)
  })
}
