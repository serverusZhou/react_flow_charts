  
function drawAImage(ctx, imgUrl, position, size) {
  ctx.beginPath()
  const image = new Image()
  image.src = imgUrl
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.height)
  ctx.closePath()
}
function drawASvgImage(ctx, imgUrl, position, size) {
  ctx.beginPath()
  const image = new Image()
  image.src = imgUrl
  ctx.drawImage(image, 0, 0, 512, 512, position.x, position.y, size.width, size.height)
  ctx.closePath()
}
function getLinePositionWithoutAssembly(from, to, fromSize, toSize) {
  let x = to.x - from.x
  let y = to.y - from.y
  let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  let fromR = Math.sqrt(Math.pow(fromSize.width, 2) + Math.pow(fromSize.height, 2)) / 2
  let toR = Math.sqrt(Math.pow(toSize.width, 2) + Math.pow(toSize.height, 2)) / 2
  return {
    from: {
      x: from.x + fromR * x / length,
      y: from.y + fromR * y / length,
    },
    to: {
      x: to.x - toR * x / length,
      y: to.y - toR * y / length,
    }
  }
}
function drawAArrow(ctx, fromPoint, endPoint, arrowWidth, lineWidth, arrowLength) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  const p0AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p4D5AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length - arrowLength)
  const p4D5AND1D20 = lineExtend.getLineExtendPosition(arrowWidth / 2, elements.length - arrowLength)
  ctx.beginPath()
  ctx.fillStyle = '#2643ef'
  ctx.lineWidth = 1
  ctx.moveTo(p0AND1D40[0].x, p0AND1D40[0].y)
  ctx.lineTo(p4D5AND1D40[0].x, p4D5AND1D40[0].y)
  ctx.lineTo(p4D5AND1D20[0].x, p4D5AND1D20[0].y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.lineTo(p4D5AND1D20[1].x, p4D5AND1D20[1].y)
  ctx.lineTo(p4D5AND1D40[1].x, p4D5AND1D40[1].y)
  ctx.lineTo(p0AND1D40[1].x, p0AND1D40[1].y)
  ctx.lineTo(p0AND1D40[0].x, p0AND1D40[0].y)
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}
function drawALineWithWidth(ctx, fromPoint, endPoint, lineWidth) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  const p5AND0 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p5AND1 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length)
  ctx.beginPath()
  ctx.fillStyle = '#2643ef'
  ctx.lineWidth = 1
  ctx.moveTo(p5AND0[0].x, p5AND0[0].y)
  ctx.lineTo(p5AND1[0].x, p5AND1[0].y)
  ctx.lineTo(p5AND1[1].x, p5AND1[1].y)
  ctx.lineTo(p5AND0[1].x, p5AND0[1].y)
  ctx.lineTo(p5AND0[0].x, p5AND0[0].y)
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}
function lineExtendFunc(from, to) {
  const x = to.x - from.x
  const y = to.y - from.y
  const length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  return {
    getLineExtendPosition: function(verticalDistence, distence) {
      const verticalDistenceX = verticalDistence * y / length
      const verticalDistenceY = verticalDistence * x / length
      const distenceX = distence * x / length
      const distenceY = distence * y / length
      return [{
        x: from.x + verticalDistenceX + distenceX,
        y: from.y - verticalDistenceY + distenceY
      }, {
        x: from.x - verticalDistenceX + distenceX,
        y: from.y + verticalDistenceY + distenceY
      }]
    },
    getLineMiddlePosition: function(distence) {
      const distenceX = distence * x / length
      const distenceY = distence * y / length
      return {
        x: from.x + distenceX,
        y: from.y + distenceY
      }
    },
    getElement: function() {
      const angle = Math.asin(y / length)
      return { x, y, length, angle, from, to }
    }
  }
}
export {
  drawAImage,
  getLinePositionWithoutAssembly,
  drawASvgImage,
  lineExtendFunc,
  drawAArrow,
  drawALineWithWidth
}
