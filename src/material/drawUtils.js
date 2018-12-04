  
function drawAImage(ctx, image, position, size) {
  ctx.beginPath()
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
function getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize) {
  const from = {
    x: fromPosition.x - fromSize.width / 2,
    y: fromPosition.y - fromSize.height / 2,
  }
  const to = {
    x: toPosition.x - toSize.width / 2,
    y: toPosition.y - toSize.height / 2,
  }
  const fCCenter = {
    x: from.x + fromSize.width / 2,
    y: from.y + fromSize.height / 2
  }
  const tCCenter = {
    x: to.x + toSize.width / 2,
    y: to.y + toSize.height / 2
  }
  const returnFrom = { x: 0, y: 0 }
  // 垂直方向
  if (fCCenter.x === tCCenter.x) {
    returnFrom.x = from.x + fromSize.width / 2
    returnFrom.y = from.y + fromSize.height * (tCCenter.y < fCCenter.y ? 0 : 1)
  }
  // 右上方
  if (tCCenter.x > fCCenter.x && tCCenter.y < fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 + fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width
      returnFrom.y = from.y + fromSize.height / 2 - fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 右下方
  if (tCCenter.x > fCCenter.x && tCCenter.y > fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 + fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y + fromSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width
      returnFrom.y = from.y + fromSize.height / 2 + fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 水平方向
  if (fCCenter.y === tCCenter.y) {
    returnFrom.x = from.x + fromSize.width * (tCCenter.x > fCCenter.x ? 1 : 0)
    returnFrom.y = from.y + fromSize.height / 2
  }
  // 左上方
  if (tCCenter.x < fCCenter.x && tCCenter.y < fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 - fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x
      returnFrom.y = from.y + fromSize.height / 2 - fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 左下方
  if (tCCenter.x < fCCenter.x && tCCenter.y > fCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > fromSize.height / fromSize.width) {
      returnFrom.x = from.x + fromSize.width / 2 - fromSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnFrom.y = from.y + fromSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= fromSize.height / fromSize.width) {
      returnFrom.x = from.x
      returnFrom.y = from.y + fromSize.height / 2 + fromSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  const returnTo = { x: 0, y: 0 }
  // 垂直方向
  if (tCCenter.x === fCCenter.x) {
    returnTo.x = to.x + toSize.width / 2
    returnTo.y = to.y + toSize.height * (fCCenter.y > tCCenter.y ? 1 : 0)
  }
  // 右上方
  if (fCCenter.x > tCCenter.x && fCCenter.y < tCCenter.y) {
    if (Math.abs((fCCenter.y - tCCenter.y) / (fCCenter.x - tCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 + toSize.height / 2 * Math.abs((fCCenter.x - tCCenter.x) / (fCCenter.y - tCCenter.y))
      returnTo.y = to.y
    }
    if (Math.abs((fCCenter.y - tCCenter.y) / (fCCenter.x - tCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width
      returnTo.y = to.y + toSize.height / 2 - toSize.width / 2 * Math.abs((fCCenter.y - tCCenter.y) / (fCCenter.x - tCCenter.x))
    }
  }
  // 右下方
  if (fCCenter.x > tCCenter.x && fCCenter.y > tCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 + toSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnTo.y = to.y + toSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width
      returnTo.y = to.y + toSize.height / 2 + toSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 水平方向
  if (fCCenter.y === tCCenter.y) {
    returnTo.x = to.x + toSize.width * (fCCenter.x > tCCenter.x ? 1 : 0)
    returnTo.y = to.y + toSize.height / 2
  }
  // 左上方
  if (fCCenter.x < tCCenter.x && fCCenter.y < tCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 - toSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnTo.y = to.y
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x
      returnTo.y = to.y + toSize.height / 2 - toSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  // 左下方
  if (fCCenter.x < tCCenter.x && fCCenter.y > tCCenter.y) {
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) > toSize.height / toSize.width) {
      returnTo.x = to.x + toSize.width / 2 - toSize.height / 2 * Math.abs((tCCenter.x - fCCenter.x) / (tCCenter.y - fCCenter.y))
      returnTo.y = to.y + toSize.height
    }
    if (Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x)) <= toSize.height / toSize.width) {
      returnTo.x = to.x
      returnTo.y = to.y + toSize.height / 2 + toSize.width / 2 * Math.abs((tCCenter.y - fCCenter.y) / (tCCenter.x - fCCenter.x))
    }
  }
  return {
    from: returnFrom,
    to: returnTo
  }
}

function getLinePositionWithoutAssemblyBySide(fromPosition, toPosition, fromSize, toSize) {
  let from = {
    x: fromPosition.x + fromSize.width / 2,
    y: fromPosition.y + fromSize.height / 2,
  }
  let to = {
    x: toPosition.x + toSize.width / 2,
    y: toPosition.y + toSize.height / 2,
  }
  if (fromSize.width * fromSize.height < 25 && toSize.width * toSize.height > 25) {
    to = getRelativePosition({
      x: toPosition.x - toSize.width / 2,
      y: toPosition.y - toSize.height / 2
    }, toSize, {
      x: fromPosition.x - fromSize.width / 2,
      y: fromPosition.y - fromSize.height / 2
    })
  }
  if (fromSize.width * fromSize.height > 25 && toSize.width * toSize.height < 25) {
    from = getRelativePosition({
      x: fromPosition.x - fromSize.width / 2,
      y: fromPosition.y - fromSize.height / 2
    }, fromSize, {
      x: toPosition.x + toSize.width / 2,
      y: toPosition.y + toSize.height / 2
    })
  }
  if (fromSize.width * fromSize.height > 25 && toSize.width * toSize.height > 25) {
    return getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize)
  }
  // console.log('fromPosition', fromPosition, 'toPosition', toPosition, 'fromSize', fromSize, 'toSize', toSize)
  // console.log('return', {
  //   from,
  //   to
  // })
  return {
    from,
    to
  }
}

function getRelativePosition(objectPosition, objectSize, pointPosition) {
  // console.log('objectPosition', objectPosition, 'objectSize', objectSize, 'pointPosition', pointPosition)
  let returnPosition = {
    x: 0,
    y: 0
  }
  // 正上或者正下
  if (pointPosition.x >= objectPosition.x && pointPosition.x <= (objectPosition.x + objectSize.width)) {
    // console.log('正上或者正下')
    returnPosition.x = pointPosition.x
    // 中心点往上
    if (pointPosition.y <= (objectPosition.y + objectSize.height / 2)) {
      returnPosition.y = objectPosition.y
    }
    // 中心点往下
    if (pointPosition.y >= (objectPosition.y + objectSize.height / 2)) {
      returnPosition.y = objectPosition.y + objectSize.height
    }
  }
  // 正左或者正右
  if (pointPosition.y >= objectPosition.y && pointPosition.y <= (objectPosition.y + objectSize.height)) {
    // console.log('正左或者正右')
    returnPosition.y = pointPosition.y
    // 中心点往左
    if (pointPosition.x <= (objectPosition.x + objectSize.width / 2)) {
      returnPosition.x = objectPosition.x
    }
    // 中心点往右
    // console.log('中心点往右')
    if (pointPosition.x >= (objectPosition.x + objectSize.width / 2)) {
      returnPosition.x = objectPosition.x + objectSize.width
    }
  }
  // 左上
  if (pointPosition.x < objectPosition.x && pointPosition.y < objectPosition.y) {
    returnPosition = objectPosition
  }
  // 右上
  if (pointPosition.x > (objectPosition.x + objectSize.width) && pointPosition.y < objectPosition.y) {
    // console.log()
    returnPosition.x = objectPosition.x + objectSize.width
    returnPosition.y = objectPosition.y
  }
  // 左下
  if ((pointPosition.x < objectPosition.x) && pointPosition.y > (objectPosition.y + objectSize.height)) {
    returnPosition.x = objectPosition.x
    returnPosition.y = objectPosition.y + objectSize.height
  }
  // 右下
  if (pointPosition.x > (objectPosition.x + objectSize.width) && pointPosition.y > (objectPosition.y + objectSize.height)) {
    returnPosition.x = objectPosition.x + objectSize.width
    returnPosition.y = objectPosition.y + objectSize.height
  }
  return returnPosition
}

function drawAArrow(ctx, fromPoint, endPoint, arrowWidth, lineWidth, arrowLength, fillStyle) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  const p0AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p4D5AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length - arrowLength)
  const p4D5AND1D20 = lineExtend.getLineExtendPosition(arrowWidth / 2, elements.length - arrowLength)
  ctx.beginPath()
  ctx.fillStyle = fillStyle
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

function drawADottedArrow(ctx, fromPoint, endPoint, arrowWidth, lineWidth, arrowLength, fillStyle) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  // const p0AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p4D5AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length - arrowLength)
  const p4D5AND1D20 = lineExtend.getLineExtendPosition(arrowWidth / 2, elements.length - arrowLength)
  ctx.beginPath()
  ctx.fillStyle = fillStyle
  ctx.lineWidth = 1
  drawADottedLine(ctx, fromPoint, {
    x: (p4D5AND1D40[0].x + p4D5AND1D40[1].x) / 2,
    y: (p4D5AND1D40[0].y + p4D5AND1D40[1].y) / 2,
  }, lineWidth, fillStyle)
  // ctx.moveTo(p0AND1D40[0].x, p0AND1D40[0].y)
  ctx.moveTo(p4D5AND1D40[0].x, p4D5AND1D40[0].y)
  ctx.lineTo(p4D5AND1D20[0].x, p4D5AND1D20[0].y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.lineTo(p4D5AND1D20[1].x, p4D5AND1D20[1].y)
  ctx.lineTo(p4D5AND1D40[1].x, p4D5AND1D40[1].y)
  // ctx.lineTo(p0AND1D40[1].x, p0AND1D40[1].y)
  // ctx.lineTo(p0AND1D40[0].x, p0AND1D40[0].y)
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}

function drawAArrowWapper(ctx, fromPoint, endPoint, arrowWidth, lineWidth, arrowLength, fillStyle) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  const p0AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p4D5AND1D40 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length - arrowLength)
  const p4D5AND1D20 = lineExtend.getLineExtendPosition(arrowWidth / 2, elements.length - arrowLength)
  ctx.beginPath()
  ctx.strokeStyle = fillStyle
  ctx.lineWidth = 2
  ctx.moveTo(p0AND1D40[0].x, p0AND1D40[0].y)
  ctx.lineTo(p4D5AND1D40[0].x, p4D5AND1D40[0].y)
  ctx.lineTo(p4D5AND1D20[0].x, p4D5AND1D20[0].y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.lineTo(p4D5AND1D20[1].x, p4D5AND1D20[1].y)
  ctx.lineTo(p4D5AND1D40[1].x, p4D5AND1D40[1].y)
  ctx.lineTo(p0AND1D40[1].x, p0AND1D40[1].y)
  ctx.lineTo(p0AND1D40[0].x, p0AND1D40[0].y)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}
function drawALineWithWidth(ctx, fromPoint, endPoint, lineWidth, fillStyle) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  const p5AND0 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p5AND1 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length)
  ctx.beginPath()
  ctx.fillStyle = fillStyle
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

function drawADottedLine(ctx, fromPoint, endPoint, lineWidth, strokeStyle) {
  ctx.beginPath()
  ctx.setLineDash([30, 2])
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  ctx.moveTo(fromPoint.x, fromPoint.y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}

function drawALineWithWidthWapper(ctx, fromPoint, endPoint, lineWidth, fillStyle) {
  const lineExtend = lineExtendFunc(fromPoint, endPoint)
  const elements = lineExtend.getElement()
  const p5AND0 = lineExtend.getLineExtendPosition(lineWidth / 2, 0)
  const p5AND1 = lineExtend.getLineExtendPosition(lineWidth / 2, elements.length)
  ctx.beginPath()
  ctx.strokeStyle = fillStyle
  ctx.lineWidth = 2
  ctx.moveTo(p5AND0[0].x, p5AND0[0].y)
  ctx.lineTo(p5AND1[0].x, p5AND1[0].y)
  ctx.lineTo(p5AND1[1].x, p5AND1[1].y)
  ctx.lineTo(p5AND0[1].x, p5AND0[1].y)
  ctx.lineTo(p5AND0[0].x, p5AND0[0].y)
  ctx.stroke()
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

function drawACircle(ctx, center, radius, color = '#39B54A') {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(...center, radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
}
export {
  drawAImage,
  getLinePositionWithoutAssembly,
  getLinePositionWithoutAssemblyBySide,
  drawASvgImage,
  lineExtendFunc,
  drawAArrow,
  drawADottedArrow,
  drawAArrowWapper,
  drawALineWithWidth,
  drawADottedLine,
  drawACircle,
  drawALineWithWidthWapper
}
