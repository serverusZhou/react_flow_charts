import React from 'react'
import ReactDOM from 'react-dom'
import MobileChart from '../mobleChart'
import assemblies from '../material/assemblies'
import parasiticAssemblies from '../material/parasiticAssemblise'
import lines from '../material/lines'
import { typeSummary, parasiticAssembliseTypeSummary } from './dict'
import CircularJSON from 'circular-json'

const cartDataStr = '{"lines":[{"id":"dd6bd07f-d474-409c-9ad9-734b2a84a704","type":"arrow","from":{"assembly":{"id":"9fc59e8d-1392-46d4-984e-6509d1d0ff8f","name":"综合废水调节池","assemblyName":"comprehensiveWasteWater","imageUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAHLCAYAAABoJRLoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3dJREFUeNrs3EEKhSAUQFGNFpYrz52ZgyYNAiFIrXPA0W8gz8sb/hAAAAAAAAAAAADgqdjwTTEmOkr15LsfF/Ph68p5tp/fwZsPeAcbmKkJGAGDgEHACBgEDAIGASNgEDAIGASMgEHAIGAEDAIGAYOAETAIGAQMAkbAIGAQMAgYAYOAQcAIGAQMAgYBI2AQMAgYBIyAQcAgYBAwAgYBg4ARMAgYBAwCRsAgYBAwCBgBg4BBwCBgBAwCBgEjYBAwCBgEjIBBwCBgEDACBgGDgEHACBgEDAJGwCBgEDAIGAGDgEHAIGAEDAIGAYOAETAIGASMgEHAIGAQMAIGAYOAQcAIGAQMAkbAIGAQMAgYAYOAQcAgYAQMAgYBg4ARMAgYBIyAQcAgYBAwAgYBg4BBwAgYBAwCBgEjYBAwCBgBg4BBwCBgBAwCBgGDgBEwCBgEDAJGwCBgEDACBgGDgEHACBgEDAIGASNgEDAIGASMgEHAIGAEDAIGAYOAETAIGAQMAkbAIGAQMAgYAYOAQcAIGAQMAgYBI2AQMAgYBIyAQcAgYAQMAgYBg4ARMAgYBAwCRsAgYBAwCBgBg4BBwAgYBAwCBgEjYBAwCBgEjIBBwCBgEDACBgGDgBEwCBgEDAJGwCBgEDAIGAGDgEHAIGAEDAIGASNgEDAIGASMgEHAIGAQMAIGAYOAQcAIGAQMAkbAIGAQMAgYAYOAQcAgYAQMAgYBg4ARMAgYBIyAQcAgYBAwAgYBg4BBwAgYBAwCRsAgYBAwCBgBg4BBwCBgBAwCBgGDgBEwCBgEjIBBwCBgEDACBgGDgEHACBgEDAIGASNgEDAIGAGDgEHAIGAEDAIGAYOAETAIGAQMAkbAIGAQMAIGAYOAQcAIGAQMAgYBI2AQMAgYBIyAQcAgYAQMAgYBg4ARMAgYBAwCRsAgYBAwCBgBg4BBwAgYBAwCBgEjYBAwCBgEjIBBwCBgBAwCBgGDgBEwCBgEDAJGwCBgEDAIGAGDgEHACBgEDAIGASNgEDAIGASMgEHAIGAQMAIGAYOAETAIGAQMAkbAML51svvungwbGBv4ZdFTYQMjYBAwCBgEjIBBwCBgBAwCBgGDgBEwCBgEDAJGwCBgEDACNgIEDAIGASNgEDAIGASMgEHAIGC4avnb0mJMdJTqyTYwAAAAAAAAAAAM7hBgAK59ERuExaFPAAAAAElFTkSuQmCC","image":{},"position":{"x":352.80645161290323,"y":146.75806451612908},"size":{"width":121,"height":271},"positionPc":{"x":88.69354838709677,"y":120.5483870967742},"sizePc":{"width":121,"height":271},"insizeSpacePercent":[0,0.2,0.06,0.2],"lines":{"from":[{"id":"dd6bd07f-d474-409c-9ad9-734b2a84a704","line":"~lines~0"}],"to":[{"id":"01becb29-8d92-4d9a-bdf4-73de74dfed5c","line":{"id":"01becb29-8d92-4d9a-bdf4-73de74dfed5c","type":"arrow","from":{"assembly":{"id":"729b62ec-8c5d-488d-9d40-63c85d8d2c9d","name":"加药泵","assemblyName":"dosingPpump","imageUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAABLCAYAAAC85F+BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+ZJREFUeNrsXctx2zAQhTO6Rx2IriC85iZek4PlCsxUkFEFkitQC0oFUQ7JVfIpx6CDSB2wA2eRgBqIoSh+FiQBvDeDoccmQQB82N23oEEhAAAActxhCC7x/vuHOR32lm+T/Pz44zCmfk9056d02FCJBmjDkcqSBiYDDQcmAiGmkg7YjhOV9QjHZ0lFMtUV68k2aiKozu6oTGtcMzdm8rGi09Mb55jYjXR8JJcJJ6s7fougzfJjzQ696h+/0HXrK+fsNWGungOMC28wBACIAPwXI7SRVCv6/erGpcVzrsqmDrJtdFIMFgHw2yIUZ2CLa/Yd7rHRKmSrgk8XpFgQRGhjhptKJ/MedG2eaDrlvy/UFzNLs7iHcY8HkpPyWuJu4gGZN2hzo0mpiKDyNhfZXMQI4UEl+lIqv4kU8VAW4UmrgzLMWtbJmQbuK/7garPZ1rqxmxr/lSbEnp7HvbIMfRMhteT32OTjLd+tF+jyFHoxnlDtyKg9so82m21tUN+BrlOu4ZfugyLSJx9ihD786oIOD3o2RRWnrowHpB7MN+WP6SEdx9QfRVRq47Nu72IIIthIKNnEZ2rXV1FvMa7MBKuyoToOzO6LA4fcRSgr54NFsCkfF4W/ZfqBvojylVX14N/qY1xCCu42c0ndGPKxecRdfKheSN5JIQCSeFMoTEwMhqY60fDoWB+45aNTbpHLuuREiAzT5xpkqKuPnLERMovAhUVwOlg0FqZCwxRE4JdQsAiOQ2p9H6pFiEEErRoCDhbngikbi2ARABGA664hInOzLjlvhqEKjAhCL6VCPkI+Qj7CIogDReCJzegU8hHyEfIR8hGAfARABMDdYNFFVP2vhO+Y2SKCiwmlFPPZAhGEewklAK7hLxLIR34iqOTMsuQ87EcQmEXIymbX2LeGAyAfAcQIZ2D1EUQ4xy8AiIDVRxDhH7D6iGARgGoArMQIR5eDxYDzHDE3EVQ2UX08Y+uifMR8ZiKC3hxjjeGAa3BaNQhslOEcEar8eVt/9064ucEHB7jeE5F9E8GGP09h2Fthro9qoTGDfAwQeg/m/AWk3RCuocqft/V3iBHEOctY1xLkJMj0+PVOBFmx8yrkYzc0TTUrEiT5dopwDeFBPfgtlXtz8/DQ5OOTEVwmHe5p1rO1UGdiaay8/oJL7X0WTT/aZcWy4I9P3HUOsZo6adHg1x6i2rJ71Pm8INASiBGARhZBMvktaeEesmBN8s8DliEyzuvyQkdU8O2sdd6oZ1njCzGNcecbs40PlPsKK//Q4/OnfDLhT6KJ7d3EEIlwpPLsSV9iEKHb4O0FANUAAAAAAEBr/BFgANKBSEQqdRqYAAAAAElFTkSuQmCC","image":{},"position":{"x":227.80645161290323,"y":106.75806451612908},"size":{"width":75,"height":75},"positionPc":{"x":-44.30645161290323,"y":82.5483870967742},"sizePc":{"width":75,"height":75},"insizeSpacePercent":[],"lines":{"from":[{"id":"01becb29-8d92-4d9a-bdf4-73de74dfed5c","line":"~lines~0~from~assembly~lines~to~0~line"}],"to":[]},"wapper":null,"belongs":[],"highLevelAssembly":"~lines~0~from~assembly","belowLevelAssembly":[],"children":[],"turnSetting":{"offsetPosition":{"x":120,"y":0}},"acturalData":{}},"position":{"x":265.30645161290323,"y":144.25806451612908},"positionPc":{"x":-6.806451612903231,"y":120.0483870967742}},"to":{"assembly":"~lines~0~from~assembly","position":{"x":413.30645161290323,"y":282.2580645161291},"positionPc":{"x":149.19354838709677,"y":256.0483870967742}},"middlePoints":[],"middlePointsPc":[]}}]},"wapper":null,"belongs":[],"highLevelAssembly":null,"belowLevelAssembly":[{"id":"89baec43-71b0-41fb-b5ab-cd2d11ce900b","name":"跳出点","assemblyName":"jumppingOutPoint","imageUrl":"","image":{},"position":{"x":549.8064516129032,"y":476.7580645161291},"size":{"width":200,"height":45},"positionPc":{"x":299.69354838709677,"y":438.5483870967742},"sizePc":{"width":200,"height":45},"insizeSpacePercent":[],"lines":{"from":[],"to":[{"id":"dd6bd07f-d474-409c-9ad9-734b2a84a704","line":"~lines~0"}]},"wapper":null,"belongs":[],"highLevelAssembly":"~lines~0~from~assembly","belowLevelAssembly":[],"children":[],"turnSetting":{"offsetPosition":{"x":-120,"y":-80}},"acturalData":{"tip":"shibai"}},"~lines~0~from~assembly~lines~to~0~line~from~assembly"],"children":[],"turnSetting":{},"acturalData":{"tip":"shibai"}},"position":{"x":413.30645161290323,"y":282.2580645161291},"positionPc":{"x":149.19354838709677,"y":256.0483870967742}},"to":{"assembly":"~lines~0~from~assembly~belowLevelAssembly~0","position":{"x":649.8064516129032,"y":499.2580645161291},"positionPc":{"x":399.69354838709677,"y":461.0483870967742}},"middlePoints":[],"middlePointsPc":[{"x":761.3636363636364,"y":313.6363636363636},{"x":690.9090909090909,"y":220.45454545454544},{"x":679.5454545454545,"y":209.0909090909091},{"x":672.7272727272727,"y":218.1818181818182}]},"~lines~0~from~assembly~lines~to~0~line",{"id":"6fead253-c564-4754-ad55-ea308911bc1d","type":"arrow","from":{"assembly":{"id":"dcc1c38f-b703-43d2-931e-7b56fa93d78d","name":"加药泵","assemblyName":"dosingPpump","imageUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAABLCAYAAAC85F+BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+ZJREFUeNrsXctx2zAQhTO6Rx2IriC85iZek4PlCsxUkFEFkitQC0oFUQ7JVfIpx6CDSB2wA2eRgBqIoSh+FiQBvDeDoccmQQB82N23oEEhAAAActxhCC7x/vuHOR32lm+T/Pz44zCmfk9056d02FCJBmjDkcqSBiYDDQcmAiGmkg7YjhOV9QjHZ0lFMtUV68k2aiKozu6oTGtcMzdm8rGi09Mb55jYjXR8JJcJJ6s7fougzfJjzQ696h+/0HXrK+fsNWGungOMC28wBACIAPwXI7SRVCv6/erGpcVzrsqmDrJtdFIMFgHw2yIUZ2CLa/Yd7rHRKmSrgk8XpFgQRGhjhptKJ/MedG2eaDrlvy/UFzNLs7iHcY8HkpPyWuJu4gGZN2hzo0mpiKDyNhfZXMQI4UEl+lIqv4kU8VAW4UmrgzLMWtbJmQbuK/7garPZ1rqxmxr/lSbEnp7HvbIMfRMhteT32OTjLd+tF+jyFHoxnlDtyKg9so82m21tUN+BrlOu4ZfugyLSJx9ihD786oIOD3o2RRWnrowHpB7MN+WP6SEdx9QfRVRq47Nu72IIIthIKNnEZ2rXV1FvMa7MBKuyoToOzO6LA4fcRSgr54NFsCkfF4W/ZfqBvojylVX14N/qY1xCCu42c0ndGPKxecRdfKheSN5JIQCSeFMoTEwMhqY60fDoWB+45aNTbpHLuuREiAzT5xpkqKuPnLERMovAhUVwOlg0FqZCwxRE4JdQsAiOQ2p9H6pFiEEErRoCDhbngikbi2ARABGA664hInOzLjlvhqEKjAhCL6VCPkI+Qj7CIogDReCJzegU8hHyEfIR8hGAfARABMDdYNFFVP2vhO+Y2SKCiwmlFPPZAhGEewklAK7hLxLIR34iqOTMsuQ87EcQmEXIymbX2LeGAyAfAcQIZ2D1EUQ4xy8AiIDVRxDhH7D6iGARgGoArMQIR5eDxYDzHDE3EVQ2UX08Y+uifMR8ZiKC3hxjjeGAa3BaNQhslOEcEar8eVt/9064ucEHB7jeE5F9E8GGP09h2Fthro9qoTGDfAwQeg/m/AWk3RCuocqft/V3iBHEOctY1xLkJMj0+PVOBFmx8yrkYzc0TTUrEiT5dopwDeFBPfgtlXtz8/DQ5OOTEVwmHe5p1rO1UGdiaay8/oJL7X0WTT/aZcWy4I9P3HUOsZo6adHg1x6i2rJ71Pm8INASiBGARhZBMvktaeEesmBN8s8DliEyzuvyQkdU8O2sdd6oZ1njCzGNcecbs40PlPsKK//Q4/OnfDLhT6KJ7d3EEIlwpPLsSV9iEKHb4O0FANUAAAAAAEBr/BFgANKBSEQqdRqYAAAAAElFTkSuQmCC","image":{},"position":{"x":194.3548387096774,"y":597.5806451612904},"size":{"width":75,"height":75},"positionPc":{"x":197.9193548387097,"y":462.51612903225816},"sizePc":{"width":75,"height":75},"insizeSpacePercent":[],"lines":{"from":[{"id":"6fead253-c564-4754-ad55-ea308911bc1d","line":"~lines~2"}],"to":[]},"wapper":null,"belongs":[],"highLevelAssembly":{"id":"15a6a0b4-a6b0-4939-b127-077990845863","name":"一级综合反应池","assemblyName":"firstLevelPool","imageUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAHLCAYAAABoJRLoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3dJREFUeNrs3EEKhSAUQFGNFpYrz52ZgyYNAiFIrXPA0W8gz8sb/hAAAAAAAAAAAADgqdjwTTEmOkr15LsfF/Ph68p5tp/fwZsPeAcbmKkJGAGDgEHACBgEDAIGASNgEDAIGASMgEHAIGAEDAIGAYOAETAIGAQMAkbAIGAQMAgYAYOAQcAIGAQMAgYBI2AQMAgYBIyAQcAgYBAwAgYBg4ARMAgYBAwCRsAgYBAwCBgBg4BBwCBgBAwCBgEjYBAwCBgEjIBBwCBgEDACBgGDgEHACBgEDAJGwCBgEDAIGAGDgEHAIGAEDAIGAYOAETAIGASMgEHAIGAQMAIGAYOAQcAIGAQMAkbAIGAQMAgYAYOAQcAgYAQMAgYBg4ARMAgYBIyAQcAgYBAwAgYBg4BBwAgYBAwCBgEjYBAwCBgBg4BBwCBgBAwCBgGDgBEwCBgEDAJGwCBgEDACBgGDgEHACBgEDAIGASNgEDAIGASMgEHAIGAEDAIGAYOAETAIGAQMAkbAIGAQMAgYAYOAQcAIGAQMAgYBI2AQMAgYBIyAQcAgYAQMAgYBg4ARMAgYBAwCRsAgYBAwCBgBg4BBwAgYBAwCBgEjYBAwCBgEjIBBwCBgEDACBgGDgBEwCBgEDAJGwCBgEDAIGAGDgEHAIGAEDAIGASNgEDAIGASMgEHAIGAQMAIGAYOAQcAIGAQMAkbAIGAQMAgYAYOAQcAgYAQMAgYBg4ARMAgYBIyAQcAgYBAwAgYBg4BBwAgYBAwCRsAgYBAwCBgBg4BBwCBgBAwCBgGDgBEwCBgEjIBBwCBgEDACBgGDgEHACBgEDAIGASNgEDAIGAGDgEHAIGAEDAIGAYOAETAIGAQMAkbAIGAQMAIGAYOAQcAIGAQMAgYBI2AQMAgYBIyAQcAgYAQMAgYBg4ARMAgYBAwCRsAgYBAwCBgBg4BBwAgYBAwCBgEjYBAwCBgEjIBBwCBgBAwCBgGDgBEwCBgEDAJGwCBgEDAIGAGDgEHACBgEDAIGASNgEDAIGASMgEHAIGAQMAIGAYOAETAIGAQMAkbAML51svvungwbGBv4ZdFTYQMjYBAwCBgEjIBBwCBgBAwCBgGDgBEwCBgEDAJGwCBgEDACNgIEDAIGASNgEDAIGASMgEHAIGC4avnb0mJMdJTqyTYwAAAAAAAAAAAM7hBgAK59ERuExaFPAAAAAElFTkSuQmCC","image":{},"position":{"x":614.9032258064516,"y":775.7903225806451},"size":{"width":121,"height":271},"positionPc":{"x":787.2272727272727,"y":621.3181818181819},"sizePc":{"width":121,"height":271},"insizeSpacePercent":"~lines~0~from~assembly~insizeSpacePercent","lines":{"from":[],"to":[{"id":"6fead253-c564-4754-ad55-ea308911bc1d","line":"~lines~2"}]},"wapper":null,"belongs":[],"highLevelAssembly":null,"belowLevelAssembly":["~lines~2~from~assembly"],"children":[],"turnSetting":{},"acturalData":{}},"belowLevelAssembly":[],"children":[],"turnSetting":{"offsetPosition":"~lines~0~from~assembly~lines~to~0~line~from~assembly~turnSetting~offsetPosition"},"acturalData":{}},"position":{"x":231.8548387096774,"y":635.0806451612904},"positionPc":{"x":235.4193548387097,"y":500.01612903225816}},"to":{"assembly":"~lines~2~from~assembly~highLevelAssembly","position":{"x":675.4032258064516,"y":911.2903225806451},"positionPc":{"x":847.7272727272727,"y":756.8181818181819}},"middlePoints":[],"middlePointsPc":[]}],"assemblies":["~lines~0~from~assembly","~lines~2~from~assembly~highLevelAssembly","~lines~0~from~assembly~belowLevelAssembly~0","~lines~0~from~assembly~lines~to~0~line~from~assembly","~lines~2~from~assembly"],"parasiticAssemblies":[]}'

function chooseAssemblyCallBakTest(assembly) {
  console.log(assembly)
}
function chooseLineCallBack(line) {
  console.log('linelineline', line)
}

function clearChoose() {
  console.log('已经clear了')
}
function getData (data) {
  localStorage.setItem('cartData', CircularJSON.stringify(Object.assign({}, data)))
}
const cartData = CircularJSON.parse(cartDataStr)
ReactDOM.render(
  <div
    style={{ maxWidth: '640px', margin: '0 auto', height: '166.4vw' }}
  >
    <MobileChart
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
      chooseLine={chooseLineCallBack}
      clearChoose={clearChoose}
      device = {'mobile'}
      getData = {getData}
    />
  </div>,
  document.getElementById('app')
)
