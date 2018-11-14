const typeBelong = 'jumppingPoint'
const assemblyType = 'PA'

const defaultSize = {
  width: 200,
  height: 45
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
      return function(ctx, position, size, imageUrl, displayName = '暂无名称') {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.font = '28px Georgia'
        ctx.fillStyle = '#000'
        ctx.fillText(displayName, position.x + size.width / 2, position.y + size.height / 2 - 20)
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
      return function(ctx, position, size, imageUrl, displayName = '暂无名称') {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.fillStyle = '#000'
        ctx.lineWidth = 1
        ctx.moveTo(position.x, position.y)
        ctx.lineTo(position.x + size.width, position.y)
        ctx.lineTo(position.x + size.width, position.y + size.height)
        ctx.lineTo(position.x, position.y + size.height)
        ctx.lineTo(position.x, position.y)
        ctx.font = "bold 28px '宋体'"
        ctx.fillText(displayName, position.x + size.width / 2, position.y + size.height / 2 - 20, size.width)
        ctx.stroke()
        ctx.restore()
      }
    }
  },
}
