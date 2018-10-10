const typeBelong = 'jumppingPoint'
const assemblyType = 'PA'

const defaultSize = {
  width: 75,
  height: 75
}

export default {
  jumppingIntPoint: {
    imageUrl: '',
    typeBelong,
    assemblyType,
    assemblyName: '跳入点',
    size: defaultSize,
    isPAndA: true,
    offsetPosition: {
      x: 120,
      y: 80
    },
    draw: () => {
      return function(ctx, position, size, imageUrl) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.lineWidth = 1
        ctx.moveTo(position.x, position.y)
        ctx.lineTo(position.x + size.width, position.y)
        ctx.lineTo(position.x + size.width, position.y + size.height)
        ctx.lineTo(position.x, position.y + size.height)
        ctx.lineTo(position.x, position.y)
        ctx.stroke()
        ctx.restore()
      }
    }
  },
  jumppingOutPoint: {
    imageUrl: '',
    typeBelong,
    assemblyType,
    assemblyName: '跳出点',
    size: defaultSize,
    isTo: true,
    offsetPosition: {
      x: -120,
      y: -80
    },
    isPAndA: true,
    draw: () => {
      return function(ctx, position, size, imageUrl) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.lineWidth = 1
        ctx.moveTo(position.x, position.y)
        ctx.lineTo(position.x + size.width, position.y)
        ctx.lineTo(position.x + size.width, position.y + size.height)
        ctx.lineTo(position.x, position.y + size.height)
        ctx.lineTo(position.x, position.y)
        ctx.stroke()
        ctx.restore()
      }
    }
  },
}
