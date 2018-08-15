
import { drawAImage } from './drawUtils'

export default {
  pool: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'general',
    size: {
      width: 50,
      height: 50
    },
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
  pool1: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
  pool2: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
  pool3: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
  pool4: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
  pool5: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
  pool6: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
  pool7: {
    imageUrl: '/assets/pool.png',
    typeBelong: 'advanced',
    size: {
      width: 50,
      height: 50
    }
  },
}
