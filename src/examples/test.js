import React from 'react'
import ReactDOM from 'react-dom'
import ReactFlowChart from '..'
import assemblies from '../material/assemblies'
import lines from '../material/lines'
import { typeSummary } from './dict'
import CircularJSON from 'circular-json'

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

function getData (data) {
  localStorage.setItem('cartData', CircularJSON.stringify(Object.assign({}, data)))
}
const cartData = CircularJSON.parse(localStorage.getItem('cartData'))
ReactDOM.render(
  <div
    style={{ width: '1500px', margin: '0 auto', paddingTop: '20px' }}
  >
    <ReactFlowChart
      typeSummary = {typeSummary}
      material = {
        {
          assemblies,
          lines
        }
      }
      assemblies= {cartData && cartData.assemblies}
      lines= {cartData && cartData.lines}
      chooseAssembly = {chooseAssemblyCallBakTest}
      device = {'mobile'}
      getData = {getData}
    />
  </div>,
  document.getElementById('app')
)
