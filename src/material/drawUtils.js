  
function drawAImage(ctx, imgUrl, position, size) {
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
export {
  drawAImage,
  getLinePositionWithoutAssembly
}
