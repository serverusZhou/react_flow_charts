import {
  getLinePositionWithoutAssembly,
  drawADottedLine,
  drawAArrow,
  drawADottedArrow,
  drawALineWithWidth,
  drawAArrowWapper,
  drawALineWithWidthWapper,
  getLinePositionWithoutAssemblyBySide
} from './drawUtils'
import sewagePipe from '../../assets/png/sewage-pipe.png'
import sludgeTube from '../../assets/png/sludge-tube.png'
import medisionLine from '../../assets/png/add-medision-line.png'

export default {
  arrow: {
    imgSrc: sewagePipe,
    lineName: '污水管',
    draw: () => {
      const center = []
      const step = 2
      return function(ctx, fromPosition, toPosition, fromSize, toSize, middlePoints, state, connectionMethod, startPoint, endPoint) {
        let from = {}
        let to = {}
        const allPoints = [startPoint || fromPosition].concat(middlePoints).concat([endPoint || toPosition])
        if (fromSize && toSize) {
          let _fromSize = startPoint ? { width: 2, height: 2 } : fromSize
          let _toSize = endPoint ? { width: 2, height: 2 } : toSize
          for (let index = 0; index < allPoints.length - 1; index++) {
            let linePosition = {}
            if (index === (allPoints.length - 2)) {
              if (connectionMethod === 'center' || !connectionMethod) {
                linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, _toSize)
              }
              if (connectionMethod === 'side') {
                linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, _toSize)
              }
              drawAArrow(ctx, linePosition.from, linePosition.to, 20, 7, 20, '#2643ef')
            } else {
              if (connectionMethod === 'center' || !connectionMethod) {
                linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              }
              if (connectionMethod === 'side') {
                linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[index + 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              }
              drawALineWithWidth(ctx, linePosition.from, linePosition.to, 7, '#2643ef')
            }
            if (state === 'animation') {
              (function drawWater() {
                const length = Math.sqrt((linePosition.from.x - linePosition.to.x) ** 2 + (linePosition.from.y - linePosition.to.y) ** 2)
                if (!center[index]) {
                  center[index] = linePosition.from
                }
                const rightLength = Math.sqrt((linePosition.from.x - center[index].x) ** 2 + (linePosition.from.y - center[index].y) ** 2)
                if (rightLength < length - 20) {
                  const position = {
                    x: center[index].x + step * ((linePosition.to.x - linePosition.from.x) / length),
                    y: center[index].y + step * ((linePosition.to.y - linePosition.from.y) / length),
                  }
                  center[index] = position
                } else {
                  center[index] = linePosition.from
                }
                // drawACircle(ctx, [center[index].x, center[index].y], 10, '#2643ef')
                if (length > 20) {
                  drawAArrow(ctx, center[index], {
                    x: center[index].x + 20 * ((linePosition.to.x - linePosition.from.x) / length),
                    y: center[index].y + 20 * ((linePosition.to.y - linePosition.from.y) / length),
                  }, 20, 7, 20, '#2643ef')
                }
              })()
            }
          }
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(38, 67, 239, 1)'
          ctx.lineWidth = 1
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    },
    drawChoosen: () => (ctx, fromPosition, toPosition, fromSize, toSize, middlePoints, state, connectionMethod, startPoint, endPoint) => {
      const allPoints = [startPoint || fromPosition].concat(middlePoints).concat([endPoint || toPosition])
      if (fromSize && toSize) {
        let _fromSize = startPoint ? { width: 2, height: 2 } : fromSize
        let _toSize = endPoint ? { width: 2, height: 2 } : toSize
        for (let index = 0; index < allPoints.length - 1; index++) {
          let linePosition = {}
          if (index === (allPoints.length - 2)) {
            if (connectionMethod === 'center' || !connectionMethod) {
              linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, _toSize)
            }
            if (connectionMethod === 'side') {
              linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, _toSize)
            }
            // const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            drawAArrowWapper(ctx, linePosition.from, linePosition.to, 30, 17, 25, 'rgba(38, 67, 239, .5)')
          } else {
            if (connectionMethod === 'center' || !connectionMethod) {
              linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            }
            if (connectionMethod === 'side') {
              linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[index + 1], (index === 0) ? _fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            }
            // const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            drawALineWithWidthWapper(ctx, linePosition.from, linePosition.to, 17, 'rgba(38, 67, 239, .5)')
          }
        }
      }
    }
  },
  pipe: {
    imgSrc: sludgeTube,
    lineName: '污泥管',
    draw: () => {
      const center = []
      const step = 2
      return function(ctx, fromPosition, toPosition, _fromSize, _toSize, middlePoints, state, connectionMethod, startPoint, endPoint) {
        let from = {}
        let to = {}
        const allPoints = [startPoint || fromPosition].concat(middlePoints).concat([endPoint || toPosition])
        let fromSize = startPoint ? { width: 2, height: 2 } : _fromSize
        let toSize = endPoint ? { width: 2, height: 2 } : _toSize
        if (_fromSize && _toSize) {
          for (let index = 0; index < allPoints.length - 1; index++) {
            let linePosition = {}
            if (index === (allPoints.length - 2)) {
              // const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              if (connectionMethod === 'center' || !connectionMethod) {
                linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              }
              if (connectionMethod === 'side') {
                linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              }
              drawAArrow(ctx, linePosition.from, linePosition.to, 20, 7, 20, '#36125B')
            } else {
              // const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              if (connectionMethod === 'center' || !connectionMethod) {
                linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              }
              if (connectionMethod === 'side') {
                linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              }
              drawALineWithWidth(ctx, linePosition.from, linePosition.to, 7, '#36125B')
            }
            if (state === 'animation') {
              (function drawWater() {
                const length = Math.sqrt((linePosition.from.x - linePosition.to.x) ** 2 + (linePosition.from.y - linePosition.to.y) ** 2)
                if (!center[index]) {
                  center[index] = linePosition.from
                }
                const rightLength = Math.sqrt((linePosition.from.x - center[index].x) ** 2 + (linePosition.from.y - center[index].y) ** 2)
                if (rightLength < length - 20) {
                  const position = {
                    x: center[index].x + step * ((linePosition.to.x - linePosition.from.x) / length),
                    y: center[index].y + step * ((linePosition.to.y - linePosition.from.y) / length),
                  }
                  center[index] = position
                } else {
                  center[index] = linePosition.from
                }
                // drawACircle(ctx, [center[index].x, center[index].y], 10, '#2643ef')
                if (length > 20) {
                  drawAArrow(ctx, center[index], {
                    x: center[index].x + 20 * ((linePosition.to.x - linePosition.from.x) / length),
                    y: center[index].y + 20 * ((linePosition.to.y - linePosition.from.y) / length),
                  }, 20, 7, 20, '#36125B')
                }
              })()
            }
          }
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(54, 18, 91, 1)'
          ctx.lineWidth = 2
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    },
    drawChoosen: () => (ctx, fromPosition, toPosition, _fromSize, _toSize, middlePoints, state, connectionMethod, startPoint, endPoint) => {
      const allPoints = [startPoint || fromPosition].concat(middlePoints).concat([endPoint || toPosition])
      let fromSize = startPoint ? { width: 2, height: 2 } : _fromSize
      let toSize = endPoint ? { width: 2, height: 2 } : _toSize
      if (_fromSize && _toSize) {
        for (let index = 0; index < allPoints.length - 1; index++) {
          let linePosition = {}
          if (index === (allPoints.length - 2)) {
            // const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            if (connectionMethod === 'center' || !connectionMethod) {
              linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            }
            if (connectionMethod === 'side') {
              linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            }
            drawAArrowWapper(ctx, linePosition.from, linePosition.to, 30, 17, 20, 'rgba(54, 18, 91, .5)')
          } else {
            // const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            if (connectionMethod === 'center' || !connectionMethod) {
              linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            }
            if (connectionMethod === 'side') {
              linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            }
            drawALineWithWidthWapper(ctx, linePosition.from, linePosition.to, 17, 'rgba(54, 18, 91, .5)')
          }
        }
      }
    }
  },
  flow: {
    imgSrc: medisionLine,
    lineName: '加药管',
    draw: () => {
      const center = []
      const step = 2
      return function(ctx, fromPosition, toPosition, _fromSize, _toSize, middlePoints, state, connectionMethod, startPoint, endPoint) {
        let from = {}
        let to = {}
        const allPoints = [startPoint || fromPosition].concat(middlePoints).concat([endPoint || toPosition])
        let fromSize = startPoint ? { width: 2, height: 2 } : _fromSize
        let toSize = endPoint ? { width: 2, height: 2 } : _toSize
        if (_fromSize && _toSize) {
          for (let index = 0; index < allPoints.length - 1; index++) {
            let linePosition = {}
            if (index === (allPoints.length - 2)) {
              // const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              if (connectionMethod === 'center' || !connectionMethod) {
                linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              }
              if (connectionMethod === 'side') {
                linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
              }
              drawADottedArrow(ctx, linePosition.from, linePosition.to, 20, 7, 20, '#4FE7FF')
            } else {
              // const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              // drawALineWithWidth(ctx, linePosition.from, linePosition.to, 10, '#4FE7FF')
              if (connectionMethod === 'center' || !connectionMethod) {
                linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              }
              if (connectionMethod === 'side') {
                linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
              }
              drawADottedLine(ctx, linePosition.from, linePosition.to, 7, '#4FE7FF')
            }
            if (state === 'animation') {
              (function drawWater() {
                const length = Math.sqrt((linePosition.from.x - linePosition.to.x) ** 2 + (linePosition.from.y - linePosition.to.y) ** 2)
                if (!center[index]) {
                  center[index] = linePosition.from
                }
                const rightLength = Math.sqrt((linePosition.from.x - center[index].x) ** 2 + (linePosition.from.y - center[index].y) ** 2)
                if (rightLength < length - 20) {
                  const position = {
                    x: center[index].x + step * ((linePosition.to.x - linePosition.from.x) / length),
                    y: center[index].y + step * ((linePosition.to.y - linePosition.from.y) / length),
                  }
                  center[index] = position
                } else {
                  center[index] = linePosition.from
                }
                // drawACircle(ctx, [center[index].x, center[index].y], 10, '#2643ef')
                if (length > 20) {
                  drawAArrow(ctx, center[index], {
                    x: center[index].x + 20 * ((linePosition.to.x - linePosition.from.x) / length),
                    y: center[index].y + 20 * ((linePosition.to.y - linePosition.from.y) / length),
                  }, 20, 7, 20, '#4FE7FF')
                }
              })()
            }
          }
        } else {
          from = { ...fromPosition }
          to = { ...toPosition }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(54, 18, 91, 1)'
          ctx.lineWidth = 2
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    },
    drawChoosen: () => (ctx, fromPosition, toPosition, _fromSize, _toSize, middlePoints, state, connectionMethod, startPoint, endPoint) => {
      const allPoints = [startPoint || fromPosition].concat(middlePoints).concat([endPoint || toPosition])
      let fromSize = startPoint ? { width: 2, height: 2 } : _fromSize
      let toSize = endPoint ? { width: 2, height: 2 } : _toSize
      if (_fromSize && _toSize) {
        for (let index = 0; index < allPoints.length - 1; index++) {
          let linePosition = {}
          if (index === (allPoints.length - 2)) {
            // const linePosition = getLinePositionWithoutAssembly(allPoints[index], toPosition, (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            if (connectionMethod === 'center' || !connectionMethod) {
              linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            }
            if (connectionMethod === 'side') {
              linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[allPoints.length - 1], (index === 0) ? fromSize : { width: 2, height: 2 }, toSize)
            }
            drawAArrowWapper(ctx, linePosition.from, linePosition.to, 30, 17, 20, 'rgba(54, 18, 91, 1)')
          } else {
            // const linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            if (connectionMethod === 'center' || !connectionMethod) {
              linePosition = getLinePositionWithoutAssembly(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            }
            if (connectionMethod === 'side') {
              linePosition = getLinePositionWithoutAssemblyBySide(allPoints[index], allPoints[index + 1], (index === 0) ? fromSize : { width: 2, height: 2 }, { width: 2, height: 2 })
            }
            drawALineWithWidthWapper(ctx, linePosition.from, linePosition.to, 17, 'rgba(54, 18, 91, 1)')
          }
        }
      }
    }
  }
}
