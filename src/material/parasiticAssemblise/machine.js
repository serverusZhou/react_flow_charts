
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
  },
  airCompressor: {
    imageUrl: airCompressorOpend,
    typeBelong,
    assemblyType,
    assemblyName: '空压机',
    size: defaultSize,
    isOccupyInternalSpace: true,
  },
  whirlwindMachine: {
    imageUrl: blowerOpen,
    typeBelong,
    assemblyType,
    assemblyName: '鼓风机',
    size: defaultSize,
    isOccupyInternalSpace: true,
  },
  dosingPpump: {
    imageUrl: dosingPumpOpen,
    typeBelong,
    assemblyType,
    assemblyName: '加药泵',
    size: defaultSize,
  },
  dosingMixer: {
    imageUrl: dosingMixerOpen,
    typeBelong,
    assemblyType,
    assemblyName: '加药搅拌机',
    size: defaultSize,
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
