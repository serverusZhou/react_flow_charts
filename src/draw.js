
function drawChooseWapper(cxt, position, size) {
  cxt.beginPath()
  cxt.lineWidth = '4'
  cxt.strokeStyle = 'green'
  cxt.rect(position.x, position.y, size.width, size.height)
  cxt.stroke()
  cxt.closePath()
}

function drawHoverWapper(cxt, position, size) {
  cxt.beginPath()
  cxt.lineWidth = '4'
  cxt.strokeStyle = 'rgba(0,0,0,.2)'
  cxt.rect(position.x, position.y, size.width, size.height)
  cxt.stroke()
  cxt.closePath()
}

function drawALine(chartsInfo, cxt, from, to) {
  cxt.beginPath()
  cxt.lineWidth = 3
  // cxt.strokeStyle = '#000'
  cxt.fillStyle = 'blue'
  // let myGradient = cxt.createLinearGradient(0, 0, 0, 170)
  // myGradient.addColorStop(0, '#000')
  // myGradient.addColorStop(1, '#000')
  // cxt.fillStyle = myGradient
  let x = to[0] - from[0]
  let y = to[1] - from[1]
  let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  const rule = 8
  const ruleX = rule * y / length * (chartsInfo.width / chartsInfo.height)
  const ruleY = rule * x / length * (chartsInfo.width / chartsInfo.height)
  let firstPointer = [from[0] - ruleX, from[1] + ruleY]
  let secondPointer = [from[0] + ruleX, from[1] - ruleY]

  let thirdPointer = [to[0] - 1 / 5 * x + ruleX, to[1] - 1 / 5 * y - ruleY]
  let forthPointer = [to[0] - 1 / 5 * x - ruleX, to[1] - 1 / 5 * y + ruleY]
  cxt.moveTo(...firstPointer)
  cxt.lineTo(...secondPointer)
  cxt.lineTo(...thirdPointer)
  cxt.lineTo(...to)
  cxt.lineTo(...forthPointer)
  cxt.lineTo(...firstPointer)
  // cxt.stroke()
  cxt.fill()
  cxt.closePath()
}
export default function(chartsInfo, cxt, config, lineConfig, items, choosenObj, hoverObj) {
  config.forEach(element => {
    const item = items[element.type]
    cxt.drawImage(item.getPic(cxt), 0, 0, 800, 800, element.position.x, element.position.y, element.size.width, element.size.height)
    if (choosenObj[element.hash]) {
      drawChooseWapper(cxt, element.position, element.size)
    }
    if (hoverObj[element.hash]) {
      drawHoverWapper(cxt, element.position, element.size)
    }
  })
  /** 为了测试用的，后面要删除 */
  // config.length >= 2 && lineConfig.push({
  //   from: config[0].hash,
  //   to: config[1].hash,
  // })
  lineConfig.forEach(element => {
    drawALine(chartsInfo, cxt, [element.from.position.x, element.from.position.y], [element.to.position.x, element.to.position.y])
  })
}
