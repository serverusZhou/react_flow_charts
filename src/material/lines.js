import { getLinePositionWithoutAssembly } from './drawUtils'

export default {
  arrow: {
    imgSrc: '/assets/arrow.png',
    draw: () => {
      return function(ctx, fromPosition, toPosition, fromSize, toSize) {
        let from = {}
        let to = {}
        if (fromSize && toSize) {
          const linePosition = getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize)
          from = { ...linePosition.from }
          to = { ...linePosition.to }
          let x = to.x - from.x
          let y = to.y - from.y
          let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
          const rule = 1 / 40 * length
          const ruleX = rule * y / length
          const ruleY = rule * x / length
          const rule1 = 1 / 20 * length
          const rule1X = rule1 * y / length
          const rule1Y = rule1 * x / length
          ctx.beginPath()
          ctx.fillStyle = 'rgba(255,87,34,1)'
          ctx.lineWidth = 1
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(from.x + 4 / 5 * x + ruleX, from.y + 4 / 5 * y - ruleY)
          ctx.lineTo(from.x + 4 / 5 * x + rule1X, from.y + 4 / 5 * y - rule1Y)
          ctx.lineTo(to.x, to.y)
          ctx.lineTo(from.x + 4 / 5 * x - rule1X, from.y + 4 / 5 * y + rule1Y)
          ctx.lineTo(from.x + 4 / 5 * x - ruleX, from.y + 4 / 5 * y + ruleY)
          ctx.lineTo(from.x, from.y)
          ctx.fill()
          ctx.closePath()
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(255,87,34,1)'
          ctx.lineWidth = 1
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    }
  },
}
