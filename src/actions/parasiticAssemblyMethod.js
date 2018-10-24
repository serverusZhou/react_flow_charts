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
    const addParasiticAssembly = {
      ...setting.parasiticAssemblySetting,
      id: UUID(),
      name: _pAssembly.assemblyName,
      assemblyName: _pAssemblyKey,
      imageUrl: _pAssembly.imageUrl,
      image: getImage(_pAssembly.imageUrl),
      belongsTo: _belongToAssembly,
      ratio: imageRatio(getImage(_pAssembly.imageUrl)),
      isOccupyInternalSpace: _pAssembly.isOccupyInternalSpace,
      initData: _pAssembly.initData,
    }
    parasiticAssemblies.push(addParasiticAssembly)
    return addParasiticAssembly
  }
  updateActuralData = (_pAssembly, _data) => {
    const { parasiticAssemblies } = this.DATA
    console.log('_pAssembly_pAssembly_pAssembly', _pAssembly)
    console.log('parasiticAssembliesparasiticAssemblies', parasiticAssemblies)
    const choosenPAsm = parasiticAssemblies.find(pasm => (pasm.id === _pAssembly.id))
    choosenPAsm.acturalData = {
      ..._pAssembly.acturalData,
      ..._data,
    }
  }
}
