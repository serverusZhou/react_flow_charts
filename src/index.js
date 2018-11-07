import ReactFlowChart from './chart'
import MobileChart from './mobleChart'
import PcChart from './pcChart'
import assemblies from './material/assemblies'
import lines from './material/lines'
import parasiticAssemblies from './material/parasiticAssemblise'
import jumpingPointParasiticAssemblies from './material/parasiticAssemblise/jumpPoint'

console.log('----------------即使没引进，也是运行了--------------------')

ReactFlowChart.MobileChart = MobileChart
ReactFlowChart.PcChart = PcChart

export default ReactFlowChart
export {
  MobileChart,
  PcChart,
  assemblies,
  parasiticAssemblies,
  jumpingPointParasiticAssemblies,
  lines
}
