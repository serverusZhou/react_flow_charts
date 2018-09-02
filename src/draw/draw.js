
function drawATip(ctx, position = { x: 0, y: 0 }, words = '暂无名称') {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.font = "24px '宋体'"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(words, position.x, position.y)
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

function drawAImage(ctx, imgUrl, position, size) {
  ctx.beginPath()
  const image = new Image()
  image.src = imgUrl
  // ctx.fillStyle = '#fff'
  // ctx.rect(position.x, position.y, size.width, size.width * image.height / image.width)
  // ctx.fill()
  ctx.drawImage(image, 0, 0, image.width, image.height, position.x, position.y, size.width, size.width * image.height / image.width)
  ctx.closePath()
}

const drawADottedLineWapper = drawADottedLine()

export default function(oprateData) {
  return {
    init: function() {
      const that = this
      let { dom } = oprateData
      const { canvas } = dom
      canvas.width = 1000
      canvas.height = 1000 * canvas.offsetHeight / canvas.offsetWidth
      oprateData.ctx = canvas.getContext('2d')
      function mainLoop() {
        oprateData.ctx.clearRect(0, 0, canvas.width, canvas.height)
        oprateData.ctx.beginPath()
        oprateData.ctx.fillStyle = '#f0f0f0'
        oprateData.ctx.rect(0, 0, canvas.width, canvas.height)
        oprateData.ctx.fill()
        that.draw()
        requestAnimationFrame(mainLoop)
      }
      mainLoop()
    },
    draw: function() {
      const { assemblies, choosenAssembly, hoverAssembly, parasiticAssemblies, choosenLine, ctx, lines, temLine } = oprateData
      assemblies.forEach(element => {
        element.draw(ctx, element.position, element.size, element.imageUrl)
        drawATip(ctx, {
          x: element.position.x + element.size.width / 2,
          y: element.position.y + element.size.height + 10
        }, element.name)

        if (choosenAssembly[element.id]) {
          const { position, size } = element
          drawADottedLineWapper(ctx, [
            { x: position.x - 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y - 5 },
          ], '#39b54a', 3)
        }
        if (hoverAssembly[element.id]) {
          const { position, size } = element
          drawADottedLineWapper(ctx, [
            { x: position.x - 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y - 5 },
            { x: position.x + size.width + 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y + size.height + 5 },
            { x: position.x - 5, y: position.y - 5 },
          ], '#39b54a')
        }
        // element.belongs.forEach((pAssembly, index) => {
        //   ctx.save()
        //   drawAImage(ctx, pAssembly.imageUrl, {
        //     x: element.position.x + element.size.width * 0.25,
        //     y: element.position.y + element.size.height * (1 - 0.15 * (1 + index)) - 22,
        //   }, {
        //     width: element.size.width * 0.5,
        //   })
        //   ctx.restore()
        // })
      })

      parasiticAssemblies.forEach((pAssembly, index) => {
        if (pAssembly.isOccupyInternalSpace) {
          drawAImage(ctx, pAssembly.imageUrl, pAssembly.position, pAssembly.size)
        }
      })
      lines.forEach(element => {
        const allPoints = [{ ...element.from.position }].concat(element.middlePoints).concat({ ...element.to.position })
        for (let i = 0; i < allPoints.length - 1; i++) {
          let fromSize = { width: 0, height: 0 }
          let toSize = { width: 0, height: 0 }
          if (i === 0) {
            fromSize = element.from.assembly.size
          }
          if (i === allPoints.length - 2) {
            toSize = element.to.assembly.size
          }
          element.draw(ctx, allPoints[i], allPoints[i + 1], fromSize, toSize)
        }
        if (choosenLine[element.id]) {
          ctx.beginPath()
          ctx.lineWidth = 1
          ctx.strokeStyle = 'rgba(0,0,0,.3)'
          ctx.moveTo(element.from.position.x, element.from.position.y)
          ctx.lineTo(element.to.position.x, element.to.position.y)
          ctx.stroke()
          ctx.closePath()
        }
      })
      if (Object.keys(temLine).length) {
        temLine.draw(ctx, temLine.from.position, temLine.to.position)
      }
    }
  }
}
  
