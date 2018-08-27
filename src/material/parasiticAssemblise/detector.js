
import phNormal from '../../../assets/png/ph-normal.png'
import orpNormal from '../../../assets/png/orp-normal.png'
import onLineInstrumentOnline from '../../../assets/png/on-line_instrument-online.png'
import ywNoraml from '../../../assets/png/yw-noraml.png'

const typeBelong = 'detector'
const assemblyType = 'PA'
export default {
  phNormal: {
    imageUrl: phNormal,
    assemblyType,
    typeBelong,
    assemblyName: 'PH在线检测仪',
  },
  orpNormal: {
    imageUrl: orpNormal,
    assemblyType,
    typeBelong,
    assemblyName: 'ORP在线检测仪',
  },
  onLineInstrumentOnline: {
    imageUrl: onLineInstrumentOnline,
    assemblyType,
    typeBelong,
    assemblyName: '水质多参数在线检测仪',
  },
  ywNoraml: {
    imageUrl: ywNoraml,
    assemblyType,
    typeBelong,
    assemblyName: '编码液位计',
  },
}
