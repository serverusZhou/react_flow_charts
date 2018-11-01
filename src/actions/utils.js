export function drawAImage(ctx, image, position, size) {
  ctx.beginPath()
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.height)
  ctx.closePath()
}

export function getImage(url) {
  const image = new Image()
  image.src = url
  return image
}

export function imageRatio(image) {
  return image.height / image.width
}
