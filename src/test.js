import React from 'react'
import ReactDOM from 'react-dom'
import ReactFlowChart from './index'
import assemblies from './material/assemblies'
import lines from './material/lines'
import { typeSummary } from './dict'

function chooseAssemblyCallBakTest(assembly, updateActuralData) {
  // console.log(assembly)
  updateActuralData({
    tip: 'shibai'
  })
  setTimeout(() => {
    updateActuralData({
      tip: '成功啦'
    })
  }, 3000)
}

ReactDOM.render(
  <div
    style={{ width: '1500px', height: '800px', margin: '0 auto', paddingTop: '20px' }}
  >
    <ReactFlowChart
      typeSummary = {typeSummary}
      assemblies={assemblies}
      lines = {lines}
      chooseAssembly = {chooseAssemblyCallBakTest}
    />
  </div>,
  document.getElementById('app')
)
