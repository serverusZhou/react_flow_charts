import { resolve } from 'path'

export function drawAImage(ctx, image, position, size) {
  ctx.beginPath()
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.height)
  ctx.closePath()
}

export function getImage(url) {
  if (!url) {
    console.error(`getImage function paramter url is not right`)
  }
  const image = new Image()
  image.src = url
  return image
}

export function imageRatio(image) {
  const promise = new Promise((resolve, reject) => {
    image.onload = () => {
      const radio = image.height / image.width
      if (!radio) {
        console.error(`image.height ${image.height} 除以 image.width ${image.width} 不是数字`, [image])
        reject(0)
      }
      resolve(radio)
    }
  })
  return promise
}
