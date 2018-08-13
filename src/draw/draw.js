
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
      const { assemblies, choosenAssembly, ctx } = oprateData
      assemblies.forEach(element => {
        console.log(element.imageUrl)
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
      })
    }
  }
}
  
