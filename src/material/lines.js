import { getLinePositionWithoutAssembly, lineExtendFunc, drawAArrow, drawALineWithWidth } from './drawUtils'
import sewagePipe from '../../assets/png/sewage-pipe.png'
import sludgeTube from '../../assets/png/sludge-tube.png'
import medisionLine from '../../assets/png/add-medision-line.png'

export default {
  arrow: {
    imgSrc: sewagePipe,
    lineName: '污水管',
    draw: () => {
      return function(ctx, fromPosition, toPosition, fromSize, toSize, middlePoints) {
        let from = {}
        let to = {}
        const allPoints = [fromPosition].concat(middlePoints).concat([toPosition])
        if (fromSize && toSize) {
          for (let index = 0; index < allPoints.length - 1; index++) {
            if (index === (allPoints.length - 2)) {
              const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              drawAArrow(ctx, linePosition.from, linePosition.to, 20, 10, 20)
            } else {
              const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              drawALineWithWidth(ctx, linePosition.from, linePosition.to, 10)
            }
          }
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
    imgSrc: sludgeTube,
    lineName: '污泥管',
    draw: () => {
      return function(ctx, fromPosition, toPosition, fromSize, toSize) {
        let from = {}
        let to = {}
        if (fromSize && toSize) {
          const linePosition = getLinePositionWithoutAssembly(fromPosition, toPosition, {
            width: fromSize.width * 3 / 2,
            height: fromSize.height * 3 / 2,
          }, {
            width: toSize.width * 3 / 2,
            height: toSize.height * 3 / 2,
          })
          const lineExtend = lineExtendFunc(linePosition.from, linePosition.to)
          const elements = lineExtend.getElement()
          const p0AND1D20 = lineExtend.getLineExtendPosition(1 / 20 * elements.length, 0)
          const p1AND1D20 = lineExtend.getLineExtendPosition(1 / 20 * elements.length, elements.length)
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(0,0,0,1)'
          ctx.lineWidth = 1
          ctx.moveTo(p0AND1D20[0].x, p0AND1D20[0].y)
          ctx.lineTo(p1AND1D20[0].x, p1AND1D20[0].y)
          ctx.stroke()
          ctx.closePath()
          ctx.restore()
          ctx.beginPath()
          ctx.moveTo(p1AND1D20[1].x, p1AND1D20[1].y)
          ctx.lineTo(p0AND1D20[1].x, p0AND1D20[1].y)
          ctx.stroke()
          ctx.closePath()
          ctx.restore()
          ctx.beginPath()
          ctx.moveTo(p0AND1D20[1].x, p0AND1D20[1].y)
          ctx.arc(linePosition.from.x, linePosition.from.y, 1 / 20 * elements.length, elements.x > 0 ? (Math.PI * 1 / 2 + elements.angle) : (Math.PI * 3 / 2 - elements.angle), elements.x > 0 ? (Math.PI * 3 / 2 + elements.angle) : (Math.PI * 1 / 2 - elements.angle))
          ctx.stroke()
          ctx.closePath()
          ctx.restore()
          ctx.beginPath()
          ctx.moveTo(p1AND1D20[0].x, p1AND1D20[0].y)
          ctx.arc(linePosition.to.x, linePosition.to.y, 1 / 20 * elements.length, elements.x > 0 ? (Math.PI * 3 / 2 + elements.angle) : (Math.PI * 1 / 2 - elements.angle), elements.x > 0 ? (Math.PI * 7 / 2 + elements.angle) : (Math.PI * 5 / 2 - elements.angle))
          ctx.stroke()
          ctx.closePath()
          ctx.restore()
          ctx.save()
          ctx.beginPath()
          ctx.fillStyle = 'rgba(0,0,0,1)'
          ctx.font = "12px '宋体'"
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          const p1D3AND1D10 = lineExtend.getLineExtendPosition(1 / 10 * elements.length, 1 / 3 * elements.length)
          ctx.translate(p1D3AND1D10[1].x, p1D3AND1D10[1].y)
          ctx.rotate(elements.x > 0 ? elements.angle : 2 * Math.PI - elements.angle)
          ctx.fillText('管道', 0, 0)
          ctx.closePath()
          ctx.restore()
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(0,0,0,1)'
          ctx.lineWidth = 2
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    }
  },
  flow: {
    imgSrc: medisionLine,
    lineName: '加药管',
    draw: () => {
      let distence = 1
      return function(ctx, fromPosition, toPosition, fromSize, toSize) {
        let from = {}
        let to = {}
        if (fromSize && toSize) {
          const linePosition = getLinePositionWithoutAssembly(fromPosition, toPosition, fromSize, toSize)
          const lineExtend = lineExtendFunc(linePosition.from, linePosition.to)
          const elements = lineExtend.getElement()
          if (distence < 30) {
            distence = distence + 1
          } else {
            distence = 1
          }
          ctx.beginPath()
          ctx.fillStyle = '#5eccdf'
          ctx.lineWidth = 2
          for (let mark = 0; mark < (elements.length / 20) - 1; mark++) {
            const pAnyAND1D20 = lineExtend.getLineExtendPosition(1 / 40 * elements.length, mark * 20 + distence)
            const dAnyplus1AND1D20 = lineExtend.getLineExtendPosition(1 / 40 * elements.length, mark * 20 + 15 + distence)
            ctx.moveTo(pAnyAND1D20[0].x, pAnyAND1D20[0].y)
            ctx.lineTo(dAnyplus1AND1D20[0].x, dAnyplus1AND1D20[0].y)
            ctx.lineTo(dAnyplus1AND1D20[1].x, dAnyplus1AND1D20[1].y)
            ctx.lineTo(pAnyAND1D20[1].x, pAnyAND1D20[1].y)
            ctx.lineTo(pAnyAND1D20[0].x, pAnyAND1D20[0].y)
          }
          ctx.fill()
          ctx.closePath()
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(0,0,0,1)'
          ctx.lineWidth = 2
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    }
  }
}
