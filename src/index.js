import ReactFlowChart from './chart'
import MobileChart from './mobleChart'
import PcChart from './pcChart'
import assemblies from './material/assemblies'
import lines from './material/lines'
import parasiticAssemblies from './material/parasiticAssemblise'
import jumpingPointParasiticAssemblies from './material/parasiticAssemblise/jumpPoint'

import {
  getLinePositionWithoutAssembly,
  drawADottedLine,
  drawAArrow,
  drawADottedArrow,
  drawALineWithWidth,
  drawAArrowWapper,
  drawALineWithWidthWapper,
  getLinePositionWithoutAssemblyBySide
} from './material/drawUtils'

const utils = {
  getLinePositionWithoutAssembly,
  drawADottedLine,
  drawAArrow,
  drawADottedArrow,
  drawALineWithWidth,
  drawAArrowWapper,
  drawALineWithWidthWapper,
  getLinePositionWithoutAssemblyBySide
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
