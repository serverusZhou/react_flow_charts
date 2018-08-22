
import { drawAImage } from '../drawUtils'
import pool from '../../../assets/pool.png'
import timg from '../../../assets/timg.jpg'
import pool3 from '../../../assets/pool3.jpg'
import pool4 from '../../../assets/pool4.jpg'

const typeBelong = 'pool'
const defaultSize = {
  width: 50,
  height: 50
}

export default {
  pool: {
    imageUrl: pool,
    typeBelong,
    assemblyName: '油墨废水调节池',
    size: defaultSize,
    draw: () => {
      let transMark = 1
      return function(
        ctx, position, size = {
          width: 100,
          height: 100
        }, imgUrl = pool
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
    imageUrl: timg,
    typeBelong: 'pool',
    assemblyName: '综合废水调节池',
    size: defaultSize
  },
  pool3: {
    imageUrl: pool3,
    typeBelong: 'pool',
    assemblyName: '酸析池',
    size: defaultSize
  },
  pool4: {
    imageUrl: pool4,
    typeBelong: 'pool',
    assemblyName: '酸析池',
    size: defaultSize
  },
  pool5: {
    imageUrl: pool4,
    typeBelong: 'pool',
    assemblyName: '酸析池',
    size: defaultSize
  },
  pool6: {
    imageUrl: pool4,
    typeBelong: 'pool',
    assemblyName: '酸析池',
    size: defaultSize
  },
}
