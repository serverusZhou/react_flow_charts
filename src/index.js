import ReactFlowChart from './chart'
import MobileChart from './mobleChart'
import PcChart from './pcChart'
import assemblies from './material/assemblies'
import lines from './material/lines'
import parasiticAssemblies from './material/parasiticAssemblise'
import jumpingPointParasiticAssemblies from './material/parasiticAssemblise/jumpPoint'

import {
  drawAImage,
  getLinePositionWithoutAssembly,
  getLinePositionWithoutAssemblyBySide,
  drawASvgImage,
  lineExtendFunc,
  drawAArrow,
  drawADottedArrow,
  drawAArrowWapper,
  drawALineWithWidth,
  drawADottedLine,
  drawACircle,
  drawALineWithWidthWapper
} from './material/drawUtils'

const utils = {
  drawAImage,
  getLinePositionWithoutAssembly,
  getLinePositionWithoutAssemblyBySide,
  drawASvgImage,
  lineExtendFunc,
  drawAArrow,
  drawADottedArrow,
  drawAArrowWapper,
  drawALineWithWidth,
  drawADottedLine,
  drawACircle,
  drawALineWithWidthWapper
}

ReactFlowChart.MobileChart = MobileChart
ReactFlowChart.PcChart = PcChart

export default ReactFlowChart
export {
  MobileChart,
  PcChart,
  assemblies,
  parasiticAssemblies,
  jumpingPointParasiticAssemblies,
  lines,
  utils
}
