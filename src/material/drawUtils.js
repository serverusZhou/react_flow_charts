  
function drawAImage(ctx, imgUrl, position, size) {
  ctx.beginPath()
  const image = new Image()
  image.src = imgUrl
  ctx.drawImage(image, 0, 0, 512, 512, position.x, position.y, size.width, size.height)
  ctx.closePath()
}

export {
  drawAImage
}
