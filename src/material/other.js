import squareOpen from '../../assets/png/square-open.png'

const typeBelong = 'others'

const mostInsizeSpacePercent = [0, 0.2, 0.06, 0.2]
const defaultSize = {
  width: 145,
  height: 145
}

const others =
  {
    wapperAssembly: {
      imgSrc: squareOpen,
      typeBelong,
      assemblyName: '水池容器',
      size: defaultSize,
      insizeSpacePercent: mostInsizeSpacePercent,
      draw: () => {
        return function(ctx, position, size, imgUrl) {
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

export {
  others
}
