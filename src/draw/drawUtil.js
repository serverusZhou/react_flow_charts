
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

export function drawAImage(ctx, image, position, size) {
  ctx.beginPath()
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.height)
  ctx.closePath()
}

export function drawATip(ctx, position = { x: 0, y: 0 }, words = '哈哈哈') {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.font = "12px '宋体'"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.translate(position.x, position.y)
  ctx.fillText(words, 0, 0)
  ctx.closePath()
}

export function getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize) {
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

export function getLinePositionWithoutAssemblyBySide(fromPosition, toPosition, fromSize, toSize) {
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
