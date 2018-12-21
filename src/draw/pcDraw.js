
function drawATip(ctx, position = { x: 0, y: 0 }, words = '暂无名称', maxWidth = 100) {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.font = "bold 28px '宋体'"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (let i = 0; i < (words.length / 4 + 1); i++) {
    if (i !== words.length / 4) {
      ctx.fillText(words.substring(4 * i, 4 * (i + 1)), position.x, position.y + (40 * i), maxWidth)
    } else {
      ctx.fillText(words.substring(4 * i, 4 * (i + 1)), position.x, position.y + (40 * i))
    }
  }
  ctx.closePath()
  ctx.restore()
}

function drawWords(ctx, position = { x: 0, y: 0 }, words = '暂无名称', maxWidth = 100) {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.font = "bold 28px '宋体'"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (let i = 0; i < (words.length / 6 + 1); i++) {
    if (i !== words.length / 6) {
      ctx.fillText(words.substring(6 * i, 6 * (i + 1)), position.x, position.y + (40 * i), maxWidth)
    } else {
      ctx.fillText(words.substring(6 * i, 6 * (i + 1)), position.x, position.y + (40 * i))
    }
  }
  ctx.closePath()
  ctx.restore()
}

function drawADottedLine() {
  let isIncrease = 1
  let distence = 5
  return function(ctx, positions, color, lineWidth = 2) {
    if (distence === 10) {
      isIncrease = -1
    }
    if (distence === 5) {
      isIncrease = 1
    }
    distence = distence + isIncrease
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.setLineDash([6, distence])
    ctx.strokeStyle = color
    positions.forEach((position, index) => {
      if (index === 0) {
        ctx.moveTo(position.x, position.y)
      } else {
        ctx.lineTo(position.x, position.y)
      }
    })
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
}

function drawALine() {
  return function(ctx, positions, color, lineWidth = 2) {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    positions.forEach((position, index) => {
      if (index === 0) {
        ctx.moveTo(position.x, position.y)
      } else {
        ctx.lineTo(position.x, position.y)
      }
    })
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
}

function drawAImage(ctx, image, position, size) {
  ctx.beginPath()
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.width * image.height / image.width)
  ctx.closePath()
}

const drawADottedLineWapper = drawADottedLine()
const drawALineWapper = drawALine()

export default function(oprateData) {
  return {
    init: function(initWidth = 1000, initHeight = 1000) {
      const that = this
      let { dom } = oprateData
      const { canvas } = dom
      canvas.width = initWidth
      canvas.height = initHeight * canvas.offsetHeight / canvas.offsetWidth
      oprateData.ctx = canvas.getContext('2d')
      function mainLoop() {
        if (oprateData.destroy) {
          return
        }
        oprateData.ctx.clearRect(0, 0, canvas.width, canvas.height)
        oprateData.ctx.beginPath()
        oprateData.ctx.fillStyle = '#f0f0f0'
        oprateData.ctx.rect(0, 0, oprateData.dom.canvas.width, oprateData.dom.canvas.height)
        oprateData.ctx.fill()
        that.draw()
        requestAnimationFrame(mainLoop)
      }
      mainLoop()
    },
    draw: function() {
      const { assemblies, choosenAssembly, hoverAssembly, parasiticAssemblies, inputs, choosenLine, ctx, lines, device } = oprateData
      assemblies.forEach(element => {
        let position = {}; let size = {}
        if (device === 'pc') {
          position = element.positionPc
          size = element.sizePc
        } else if (device === 'mobile') {
          position = element.position
          size = element.size
        }

        element.draw(ctx, position, size, element.image, element.displayName, element.status, element)
        if (!element.highLevelAssembly && (element.assemblyName !== 'wapperAssembly')) {
          drawATip(ctx, {
            x: position.x + size.width / 2,
            y: position.y + size.height + 10
          }, element.name, device === 'pc' ? element.sizePc.width : element.size.width)
        }
        if (choosenAssembly[element.id]) {
          drawALineWapper(ctx, [
            { x: position.x - 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y - 5 },
          ], '#000', 3)
        }
        if (hoverAssembly[element.id]) {
          drawADottedLineWapper(ctx, [
            { x: position.x - 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y - 5 },
          ], '#39b54a')
        }
      })
      lines.forEach(element => {
        let fromPosition = {}; let fromSize = {}; let toPosition = {}; let toSize = {}; let middlePoints = []
        if (device === 'pc') {
          fromPosition = element.from.positionPc
          toPosition = element.to.positionPc
          fromSize = element.from.assembly.sizePc
          toSize = element.to.assembly.sizePc
          middlePoints = element.middlePointsPc
        } else if (device === 'mobile') {
          fromPosition = element.from.position
          toPosition = element.to.position
          fromSize = element.from.assembly.size
          toSize = element.to.assembly.size
          middlePoints = element.middlePoints
        }

        if (element.draw && (!(element.from.assembly.wapper || element.to.assembly.wapper)) ||
        (element.from.assembly.highLevelAssembly || element.to.assembly.highLevelAssembly)) {
          element.draw(ctx, fromPosition, toPosition, fromSize, toSize, middlePoints, element.state, element.connectionMethod)
        }
        if (choosenLine[element.id]) {
          element.drawChoosen ? element.drawChoosen(ctx, fromPosition, toPosition, fromSize, toSize, middlePoints, element.state, element.connectionMethod) : (function() {
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = '#666'
            ctx.moveTo(fromPosition.x, fromPosition.y)
            ctx.lineTo(toPosition.x, toPosition.y)
            ctx.stroke()
            ctx.closePath()
          })()
        }
      })
      parasiticAssemblies.filter(pA => !pA.isOccupyInternalSpace).forEach((pAssembly, index) => {
        if (pAssembly.status !== 'hidden') {
          if (pAssembly.draw) {
            if (device === 'mobile') {
              pAssembly.draw(ctx, pAssembly.image, pAssembly.ratio, pAssembly.belongsTo.position, pAssembly.belongsTo.size, pAssembly, device)
            }
            if (device === 'pc') {
              pAssembly.draw(ctx, pAssembly.image, pAssembly.ratio, pAssembly.belongsTo.positionPc, pAssembly.belongsTo.sizePc, pAssembly, device)
            }
          }
        }
      })
      parasiticAssemblies.filter(pA => pA.isOccupyInternalSpace).forEach((pAssembly, index) => {
        if (pAssembly.status !== 'hidden') {
          if (device === 'mobile') {
            drawAImage(ctx, pAssembly.image, pAssembly.position, pAssembly.size, pAssembly)
          }
          if (device === 'pc') {
            drawAImage(ctx, pAssembly.image, pAssembly.positionPc, pAssembly.sizePc, pAssembly)
          }
        }
      })
      inputs.forEach(input => {
        if (device === 'mobile') {
          drawWords(ctx, {
            x: input.position.x + input.size.width / 2,
            y: input.position.y + 20
          }, input.words, input.maxLength)
        }
        if (device === 'pc') {
          if (!input.positionPc) {
            input.positionPc = input.position
          }
          if (!input.sizePc) {
            input.sizePc = input.size
          }
          drawWords(ctx, {
            x: input.positionPc.x + input.sizePc.width / 2,
            y: input.positionPc.y + 20
          }, input.words, input.maxLength)
        }
      })
    }
  }
}
  
