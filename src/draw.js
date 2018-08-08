
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
  cxt.strokeStyle = '#000'
  let x = to[0] - from[0]
  let y = to[1] - from[1]
  const ruleX = 5
  const ruleY = ruleX * Math.abs(x) / Math.abs(y) * (chartsInfo.width / chartsInfo.height)
  let firstPointer = [from[0] - ruleX, from[1] + ruleY]
  let secondPointer = [from[0] + ruleX, from[1] - ruleY]
  let thirdPointer = [to[0] - 1 / 3 * x + ruleX, to[1] - 1 / 3 * y - ruleY]
  let forthPointer = [to[0] - 1 / 3 * x - ruleX, to[1] - 1 / 3 * y + ruleY]
  cxt.moveTo(...firstPointer)
  cxt.lineTo(...secondPointer)
  cxt.lineTo(...thirdPointer)
  cxt.lineTo(...to)
  cxt.lineTo(...forthPointer)
  cxt.lineTo(...firstPointer)
  cxt.stroke()
  cxt.closePath()
}
export default function(chartsInfo, cxt, config, lineConfig, items, choosenObj, hoverObj) {
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
  /** 为了测试用的，后面要删除 */
  // config.length >= 2 && lineConfig.push({
  //   from: config[0].hash,
  //   to: config[1].hash,
  // })
  // lineConfig.forEach(element => {
  //   let from = [0, 0]
  //   let to = [0, 0]
  //   config.forEach(ele => {
  //     if (ele.hash === element.from) {
  //       from = [ele.position.x, ele.position.y]
  //     }
  //     if (ele.hash === element.to) {
  //       to = [ele.position.x, ele.position.y]
  //     }
  //   })
  drawALine(chartsInfo, cxt, [150, 178], [300, 300])
  // })
}
