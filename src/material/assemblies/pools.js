
import { drawAImage } from '../drawUtils'

const typeBelong = 'pool'
const defaultSize = {
  width: 50,
  height: 50
}

export default {
  pool: {
    imageUrl: '/assets/pool.png',
    typeBelong,
    assemblyName: '油墨废水调节池',
    size: defaultSize,
    draw: () => {
      let transMark = 1
      return function(
        ctx, position, size = {
          width: 100,
          height: 100
        }, imgUrl = '/assets/pool.png'
      ) {
        drawAImage(ctx, imgUrl, position, {
          ...size
        })
        if (transMark / 2) {
          ctx.beginPath()
          ctx.lineWidth = 1
          ctx.strokeStyle = '#000'
          ctx.moveTo(position.x, position.y)
          ctx.lineTo(position.x + size.width, position.y)
          ctx.lineTo(position.x + size.width, position.y + size.height)
          ctx.lineTo(position.x, position.y + size.height)
          ctx.lineTo(position.x, position.y)
          ctx.stroke()
          ctx.closePath()
          transMark = 0
        } else {
          transMark = 1
        }
      }
    }
  },
  pool2: {
    imageUrl: '/assets/timg.jpg',
    typeBelong: 'pool',
    assemblyName: '综合废水调节池',
    size: defaultSize
  },
  pool3: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'pool',
    assemblyName: '酸析池',
    size: defaultSize
  },
}
