
export function drawChooseWapper(cxt, position, size) {
  cxt.beginPath()
  cxt.lineWidth = '4'
  cxt.strokeStyle = 'green'
  cxt.rect(position.x, position.y, size.width, size.height)
  cxt.stroke()
  cxt.closePath()
}
    
export function drawHoverWapper(cxt, position, size) {
  cxt.beginPath()
  cxt.lineWidth = '4'
  cxt.strokeStyle = 'rgba(0,0,0,.2)'
  cxt.rect(position.x, position.y, size.width, size.height)
  cxt.stroke()
  cxt.closePath()
}
    
export function drawALine(chartsInfo, cxt, from, to) {
  cxt.beginPath()
  cxt.lineWidth = 3
  cxt.fillStyle = 'blue'
  let x = to[0] - from[0]
  let y = to[1] - from[1]
  let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  const rule = 6
  const ruleX = rule * y / length * (chartsInfo.width / chartsInfo.height)
  const ruleY = rule * x / length * (chartsInfo.width / chartsInfo.height)
  let firstPointer = [from[0] - ruleX, from[1] + ruleY]
  let secondPointer = [from[0] + ruleX, from[1] - ruleY]
  let thirdPointer = [to[0] - 1 / 5 * x + ruleX, to[1] - 1 / 5 * y - ruleY]
  let forthPointer = [to[0] - 1 / 5 * x - ruleX, to[1] - 1 / 5 * y + ruleY]
  let fifthPointer = [to[0] - 1 / 5 * x + ruleX * 2, to[1] - 1 / 5 * y - ruleY * 2]
  let sixthPointer = [to[0] - 1 / 5 * x - ruleX * 2, to[1] - 1 / 5 * y + ruleY * 2]
  cxt.moveTo(...firstPointer)
  cxt.lineTo(...secondPointer)
  cxt.lineTo(...thirdPointer)
  cxt.lineTo(...fifthPointer)
  cxt.lineTo(...to)
  cxt.lineTo(...sixthPointer)
  cxt.lineTo(...forthPointer)
  cxt.lineTo(...firstPointer)
  // cxt.stroke()
  cxt.fill()
  cxt.closePath()
}
    
export function drawAPipeWapper() {
  let distence = 1
  return function (chartsInfo, cxt, from, to) {
    cxt.beginPath()
    cxt.strokeStyle = '#fff'
    cxt.lineWidth = 3
    let x = to[0] - from[0]
    let y = to[1] - from[1]
    let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    const rule = 6
    const ruleX = rule * y / length * (chartsInfo.width / chartsInfo.height)
    const ruleY = rule * x / length * (chartsInfo.width / chartsInfo.height)
    let firstPointer = [from[0] - ruleX, from[1] + ruleY]
    let secondPointer = [from[0] + ruleX, from[1] - ruleY]
    let thirdPointer = [to[0] + ruleX, to[1] - ruleY]
    let forthPointer = [to[0] - ruleX, to[1] + ruleY]
    cxt.moveTo(...firstPointer)
    cxt.lineTo(...secondPointer)
    cxt.lineTo(...thirdPointer)
    cxt.lineTo(...forthPointer)
    cxt.lineTo(...firstPointer)
    cxt.stroke()
    cxt.closePath()
    if (distence < 30) {
      distence = distence + 0.5
    } else {
      distence = 1
    }
    const rX = distence * x / length
    const rY = distence * y / length
    cxt.beginPath()
    cxt.fillStyle = '#ccc'
    for (let mark = 1; mark < (length / 30); mark++) {
      cxt.moveTo(from[0] - ruleX + rX + 30 * mark * x / length, from[1] + ruleY + rY + 30 * mark * y / length)
      cxt.lineTo(from[0] + ruleX + rX + 30 * mark * x / length, from[1] - ruleY + rY + 30 * mark * y / length)
      cxt.lineTo(from[0] + rX + 20 * x / length + 30 * mark * x / length, from[1] + rY + 20 * y / length + 30 * mark * y / length)
      cxt.lineTo(from[0] + rX + 20 * x / length + 30 * mark * x / length, from[1] + rY + 20 * y / length + 30 * mark * y / length)
      cxt.lineTo(from[0] - ruleX + rX + 30 * mark * x / length, from[1] + ruleY + rY + 30 * mark * y / length)
    }
    cxt.fill()
    cxt.closePath()
  }
}

export function drawAImage(ctx, imgUrl, position, size) {
  ctx.beginPath()
  const image = new Image()
  image.src = imgUrl
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.height)
  ctx.closePath()
}
