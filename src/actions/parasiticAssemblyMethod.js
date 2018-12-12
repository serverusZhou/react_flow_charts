import UUID from 'uuid'
import setting from './defaltSettings'
import { getImage, imageRatio } from './utils'

export default class ParasiticAssemblyMethod {
  constructor(data) {
    this.DATA = data
  }
  add = (_pAssemblyKey, _belongToAssembly) => {
    const { parasiticAssemblies, material } = this.DATA
    const _pAssembly = material.parasiticAssemblies[_pAssemblyKey]
    const image = getImage(_pAssembly.imageUrl)
    // const ratio = await imageRatio(getImage(_pAssembly.imageUrl))
    const addParasiticAssembly = {
      ...setting.parasiticAssemblySetting,
      id: UUID(),
      name: _pAssembly.assemblyName,
      assemblyName: _pAssemblyKey,
      imageUrl: _pAssembly.imageUrl,
      image,
      belongsTo: _belongToAssembly,
      ratio: 1,
      isOccupyInternalSpace: _pAssembly.isOccupyInternalSpace,
      initData: _pAssembly.initData,
      assemblyType: _pAssembly.assemblyType,
      typeBelong: _pAssembly.typeBelong,
      status: 'normal',
      draw: _pAssembly.draw
        ? _pAssembly.draw()
        : null,
    }
    imageRatio(getImage(_pAssembly.imageUrl)).then((ratio) => {
      addParasiticAssembly.ratio = ratio
    })
    parasiticAssemblies.push(addParasiticAssembly)
    return addParasiticAssembly
  }
  deleteWithId = (id) => {
    const { parasiticAssemblies: pAsms } = this.DATA
    const result = pAsms.reduce((ev, pAsm) => {
      if (pAsm.id === id) {
        ev.asm = pAsm.belongsTo
      } else {
        ev.pAsms.push(pAsm)
      }
      return ev
    }, {
      pAsms: [],
      asm: {}
    })
    this.DATA.parasiticAssemblies = result.pAsms
    return result.asm
  }
  updateActuralData = (_pAssembly, _data) => {
    const { parasiticAssemblies } = this.DATA
    const choosenPAsm = parasiticAssemblies.find(pasm => (pasm.id === _pAssembly.id))
    choosenPAsm.acturalData = {
      ..._pAssembly.acturalData,
      ..._data,
    }
  }
  updateStatus = (pAsm, status) => {
    pAsm.status = status
  }
}
