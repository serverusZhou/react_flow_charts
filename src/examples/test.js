import React from 'react'
import ReactDOM from 'react-dom'
import ReactFlowChart from '..'
import assemblies from '../material/assemblies'
import parasiticAssemblies from '../material/parasiticAssemblise'
import lines from '../material/lines'
import { typeSummary, parasiticAssembliseTypeSummary } from './dict'
import CircularJSON from 'circular-json'

function chooseAssemblyCallBakTest(assembly, updateActuralData, handleJumpPoint) {
  console.log(assembly)
  updateActuralData({
    tip: 'shibai'
  })
  setTimeout(() => {
    updateActuralData({
      tip: '成功啦'
    })
    handleJumpPoint('in')
  }, 3000)
}

function getData (data) {
  localStorage.setItem('cartData', CircularJSON.stringify(Object.assign({}, data)))
}
const cartData = CircularJSON.parse(localStorage.getItem('cartData'))
ReactDOM.render(
  <div
    style={{ width: '1100px', margin: '0 auto', paddingTop: '20px' }}
  >
    <ReactFlowChart
      typeSummary = {typeSummary}
      parasiticAssembliseTypeSummary = {parasiticAssembliseTypeSummary}
      material = {
        {
          assemblies,
          parasiticAssemblies,
          lines
        }
      }
      assemblies= {(cartData && cartData.assemblies) || []}
      lines= {(cartData && cartData.lines) || []}
      parasiticAssemblies = {(cartData && cartData.parasiticAssemblies) || []}
      chooseAssembly = {chooseAssemblyCallBakTest}
      device = {'mobile'}
      getData = {getData}
      title = {'污水处理流程'}
      disabled = {false}
      btns = {<div><button>新建流程</button><button>新建流程</button><button>新建流程</button><button>新建流程</button></div>}
    />
  </div>,
  document.getElementById('app')
)
