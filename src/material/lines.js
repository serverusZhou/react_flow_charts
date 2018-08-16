import { getLinePositionWithoutAssembly } from './drawUtils'

export default {
  arrow: {
    imgSrc: '/assets/arrow.png',
    lineName: '连接线',
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
          ctx.save()
          ctx.beginPath()
          ctx.fillStyle = 'rgba(255,87,34,1)' // 文字颜色
          ctx.font = "18px '宋体'" // 文字大小及字体
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          let angle = Math.asin(y / length)
          if (x < 0) {
            angle = Math.PI - angle
          }
          ctx.translate(from.x + 1 / 3 * x - rule1X * 2, from.y + 1 / 3 * y + rule1Y * 2)
          ctx.rotate(angle)
          ctx.fillText('连接线', 0, 0)
          ctx.closePath()
          ctx.restore()
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
  pipe: {
    imgSrc: '/assets/pipe.png',
    lineName: '管道',
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
          ctx.fillStyle = 'rgba(0,0,0,1)'
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
          ctx.save()
          ctx.beginPath()
          ctx.fillStyle = 'rgba(0,0,0,1)' // 文字颜色
          ctx.font = "18px '宋体'" // 文字大小及字体
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          let angle = Math.asin(y / length)
          if (x < 0) {
            angle = Math.PI - angle
          }
          ctx.translate(from.x + 1 / 3 * x - rule1X * 2, from.y + 1 / 3 * y + rule1Y * 2)
          ctx.rotate(angle)
          ctx.fillText('管道', 0, 0)
          ctx.closePath()
          ctx.restore()
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          // let x = to.x - from.x
          // let y = to.y - from.y
          // let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
          ctx.beginPath()
          ctx.fillStyle = 'rgba(0,0,0,1)'
          ctx.lineWidth = 2
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.fill()
          ctx.closePath()
        }
      }
    }
  }
}
