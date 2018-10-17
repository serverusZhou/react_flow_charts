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
              drawAArrow(ctx, linePosition.from, linePosition.to, 20, 10, 20, '#2643ef')
            } else {
              const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              drawALineWithWidth(ctx, linePosition.from, linePosition.to, 10, '#2643ef')
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
    },
    drawChoosen: () => {

    }
  },
  pipe: {
    imgSrc: sludgeTube,
    lineName: '污泥管',
    draw: () => {
      return function(ctx, fromPosition, toPosition, fromSize, toSize, middlePoints) {
        let from = {}
        let to = {}
        const allPoints = [fromPosition].concat(middlePoints).concat([toPosition])
        if (fromSize && toSize) {
          for (let index = 0; index < allPoints.length - 1; index++) {
            if (index === (allPoints.length - 2)) {
              const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              drawAArrow(ctx, linePosition.from, linePosition.to, 20, 10, 20, '#36125B')
            } else {
              const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              drawALineWithWidth(ctx, linePosition.from, linePosition.to, 10, '#36125B')
            }
          }
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(255,87,34,1)'
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
