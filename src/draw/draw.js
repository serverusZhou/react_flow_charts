
function drawATip(ctx, position = { x: 0, y: 0 }, words = '哈哈哈') {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.font = "24px '宋体'"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  // ctx.translate(position.x, position.y)
  ctx.fillText(words, position.x, position.y)
  ctx.closePath()
  ctx.restore()
}

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
        that.draw()
        requestAnimationFrame(mainLoop)
      }
      mainLoop()
    },
    draw: function() {
      const { assemblies, choosenAssembly, hoverAssembly, choosenLine, ctx, lines, temLine } = oprateData
      assemblies.forEach(element => {
        element.draw(ctx, element.position, element.size, element.imageUrl)
        if (choosenAssembly[element.id]) {
          const { position, size } = element
          ctx.beginPath()
          ctx.lineWidth = 1
          ctx.fillStyle = 'rgba(0,0,0,.3)'
          ctx.moveTo(position.x, position.y)
          ctx.lineTo(position.x + size.width, position.y)
          ctx.lineTo(position.x + size.width, position.y + size.height)
          ctx.lineTo(position.x, position.y + size.height)
          ctx.lineTo(position.x, position.y)
          ctx.fill()
          ctx.closePath()
        }
        if (hoverAssembly[element.id]) {
          drawATip(ctx, {
            x: element.position.x,
            y: element.position.y + element.size.height + 10
          }, element.name)
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
  
