  
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
