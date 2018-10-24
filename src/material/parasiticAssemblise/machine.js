import { drawAImage } from '../drawUtils'
import waterPumpOpen from '../../../assets/png/water-pump-open.png'
import airCompressorOpend from '../../../assets/png/air-compressor-opend.png'
import blowerOpen from '../../../assets/png/blower-open.png'
import dosingPumpOpen from '../../../assets/png/dosing-pump-open.png'
import dosingMixerOpen from '../../../assets/png/dosing-mixer_open.png'
import blenderOpen from '../../../assets/png/blender-open.png'

const typeBelong = 'machine'
const assemblyType = 'PA'

const defaultSize = {
  width: 75,
  height: 75
}

export default {
  waterPump: {
    imageUrl: waterPumpOpen,
    typeBelong,
    assemblyType,
    assemblyName: '水泵',
    size: defaultSize,
    isOccupyInternalSpace: true
  },
  airCompressor: {
    imageUrl: airCompressorOpend,
    typeBelong,
    assemblyType,
    assemblyName: '空压机',
    size: defaultSize,
  },
  whirlwindMachine: {
    imageUrl: blowerOpen,
    typeBelong,
    assemblyType,
    assemblyName: '鼓风机',
    size: defaultSize,
  },
  dosingPpump: {
    imageUrl: dosingPumpOpen,
    typeBelong,
    assemblyType,
    assemblyName: '加药泵',
    size: defaultSize,
    isPAndA: true,
    offsetPosition: { x: 120, y: -135.5 },
    draw: () => (ctx, position, size, image) => {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.drawImage(image, position.x, position.y, size.width, size.height)
      ctx.stroke()
      ctx.restore()
    }
  },
  dosingMixer: {
    imageUrl: dosingMixerOpen,
    typeBelong,
    assemblyType,
    assemblyName: '加药搅拌机',
    size: defaultSize,
    draw: () => {
      return function(ctx, image, ratio, belongsToAssemblyPosition, belongsToAssemblySize) {
        drawAImage(ctx, image, {
          x: belongsToAssemblyPosition.x + 1 / 4 * belongsToAssemblySize.width,
          y: belongsToAssemblyPosition.y - 2 / 5 * belongsToAssemblySize.height,
        }, {
          width: belongsToAssemblySize.width * 1 / 2,
          height: belongsToAssemblySize.width * 1 / 2 * ratio
        })
        ctx.restore()
      }
    }
  },
  blender: {
    imageUrl: blenderOpen,
    typeBelong,
    assemblyType,
    assemblyName: '搅拌机',
    size: defaultSize,
    isOccupyInternalSpace: true,
  },
}
