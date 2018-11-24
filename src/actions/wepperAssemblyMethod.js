import UUID from 'uuid'
import setting from './defaltSettings'

export default class WepperAssemblyMethod {
  constructor(data) {
    this.DATA = data
  }
  add = (_assemblyKey, _position) => {
    const { assemblies, material, device } = this.DATA
    const _assembly = material.others[_assemblyKey]
    const size = (function() {
      let width = (_assembly.size && _assembly.size.width) || 300
      let height = (_assembly.size && _assembly.size.height) || 300
      return {
        width: (device === 'mobile') ? width * 2 : width,
        height: (device === 'mobile') ? height * 2 : height
      }
    })()
    const addAssembly = {
      ...setting.assembly,
      id: UUID(),
      name: _assembly.assemblyName,
      assemblyName: _assemblyKey,
      imageUrl: _assembly.imgSrc,
      position: { x: _position.x - size.width / 2, y: _position.y - size.height / 2 },
      size: { width: size.width, height: size.height },
      positionPc: { x: _position.x - size.width / 2, y: _position.y - size.height / 2 },
      sizePc: { width: size.width, height: size.height },
      insizeSpacePercent: _assembly.insizeSpacePercent,
      draw: _assembly.draw ? _assembly.draw() : function(ctx, position, size, imgUrl) {
        drawAImage(ctx, imgUrl, position, size)
      },
    }
    assemblies.push(addAssembly)
  }
  reLayout = (_assembly) => {
    // const { device } = this.DATA
    const childNum = _assembly.children.length
    const { position, size, positionPc, sizePc } = _assembly
    _assembly.children.forEach((child, i) => {
      child.size.height = size.height - 10
      child.size.width = (size.width - 10 - childNum * 4) / childNum
      child.position.x = position.x + 5 + i * child.size.width + childNum * 2 * (i + 1)
      child.position.y = position.y + 5
    })
    _assembly.children.forEach((child, i) => {
      child.sizePc.height = sizePc.height - 10
      child.sizePc.width = (sizePc.width - 10 - childNum * 4) / childNum
      child.positionPc.x = positionPc.x + 5 + i * child.sizePc.width + childNum * 2 * (i + 1)
      child.positionPc.y = positionPc.y + 5
    })
  }
}
