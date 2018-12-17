import UUID from 'uuid'
import setting from './defaltSettings'
import { drawAImage, getImage } from './utils'

export default class AssemblyMethod {
  constructor(data) {
    this.DATA = data
  }
  add = (_assemblyKey, _position) => {
    const { assemblies, material, device, dom } = this.DATA
    const _assembly = material.assemblies[_assemblyKey]
    const size = (function() {
      let width = (_assembly.size && _assembly.size.width) || 100
      let height = (_assembly.size && _assembly.size.height) || 100
      return {
        width: (device === 'mobile') ? width * 2 : width,
        height: (device === 'mobile') ? height * 2 : height
      }
    })()
    let positionX = 0
    let positionY = 0
    if ((_position.x - size.width / 2) > 0 && (_position.x - size.width / 2) < dom.canvas.width) {
      positionX = (_position.x - size.width / 2)
    }
    if ((_position.x - size.width / 2) > dom.canvas.width) {
      positionX = dom.canvas.width
    }
    if ((_position.y - size.height / 2) > 0 && (_position.y - size.height / 2) < dom.canvas.height) {
      positionY = (_position.y - size.height / 2)
    }
    if ((_position.y - size.height / 2) > dom.canvas.height) {
      positionY = dom.canvas.height
    }
    const addAssembly = {
      ...setting.assembly,
      id: UUID(),
      name: _assembly.assemblyName,
      assemblyName: _assemblyKey,
      imageUrl: _assembly.imageUrl,
      image: getImage(_assembly.imageUrl),
      position: { x: positionX, y: positionY },
      size: { width: size.width, height: size.height },
      positionPc: { x: positionX, y: positionY },
      sizePc: { width: size.width, height: size.height },
      insizeSpacePercent: _assembly.insizeSpacePercent,
      initData: _assembly.initData,
      typeBelong: _assembly.typeBelong,
      status: 'normal',
      draw: _assembly.draw
        ? _assembly.draw()
        : function(ctx, _position, size, image, status) {
          drawAImage(ctx, image, _position, size)
        },
    }
    assemblies.push(addAssembly)
    return addAssembly
  }
  delete = (_assembly) => {
    let getNum = 99999
    const { assemblies } = this.DATA
    assemblies.forEach((asm, index) => {
      if (asm.id === _assembly.id) {
        getNum = index
      }
    })
    if (getNum !== 99999) {
      assemblies.splice(getNum, 1)
    }
    return _assembly
  }
  addWithoutKey = (settings) => {
    const { assemblies } = this.DATA
    const addAssembly = {
      ...setting.assembly,
      ...settings
    }
    assemblies.push(addAssembly)
    return addAssembly
  }
  reLayoutPAssemblies = (assembly) => {
    const { device } = this.DATA
    let lessHeight = 0
    assembly.belongs.filter(belong => belong.isOccupyInternalSpace).forEach(belong => {
      let pPosition = {}; let pSize = {}
      if (device === 'mobile') {
        pPosition = assembly.position
        pSize = assembly.size
      } else if (device === 'pc') {
        pPosition = assembly.positionPc
        pSize = assembly.sizePc
      }
      const updateInfo = {
        position: {
          x: pPosition.x + assembly.insizeSpacePercent[3] * pSize.width,
          y: pPosition.y + pSize.height - assembly.insizeSpacePercent[2] * pSize.height - pSize.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]) * belong.ratio - lessHeight,
        }, size: {
          width: pSize.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]),
          height: pSize.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]) * belong.ratio
        }
      }
      lessHeight = lessHeight + pSize.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]) * belong.ratio
      if (device === 'mobile') {
        belong.position = updateInfo.position
        belong.size = updateInfo.size
      } else if (device === 'pc') {
        belong.positionPc = updateInfo.position
        belong.sizePc = updateInfo.size
      }
    })
  }
  
  addPAssembly = (asb, pAsb) => {
    const ratio = pAsb.ratio
    const remainPosition = asb.belongs.reduce((ev, belong) => {
      if (belong.isOccupyInternalSpace) {
        ev.position.y = ev.position.y - belong.size.height
      }
      return ev
    }, { position: {
      x: asb.position.x + asb.insizeSpacePercent[3] * asb.size.width,
      y: asb.position.y + asb.size.height - asb.insizeSpacePercent[2] * asb.size.height - asb.size.width * (1 - asb.insizeSpacePercent[1] - asb.insizeSpacePercent[3]) * ratio,
    }, size: {
      width: asb.size.width * (1 - asb.insizeSpacePercent[1] - asb.insizeSpacePercent[3]),
      height: asb.size.width * (1 - asb.insizeSpacePercent[1] - asb.insizeSpacePercent[3]) * ratio
    }, positionPc: {
      x: asb.positionPc.x + asb.insizeSpacePercent[3] * asb.sizePc.width,
      y: asb.positionPc.y + asb.sizePc.height - asb.insizeSpacePercent[2] * asb.sizePc.height - asb.sizePc.width * (1 - asb.insizeSpacePercent[1] - asb.insizeSpacePercent[3]) * ratio,
    }, sizePc: {
      width: asb.sizePc.width * (1 - asb.insizeSpacePercent[1] - asb.insizeSpacePercent[3]),
      height: asb.sizePc.width * (1 - asb.insizeSpacePercent[1] - asb.insizeSpacePercent[3]) * ratio
    }})
    pAsb.position = remainPosition.position
    pAsb.size = remainPosition.size
    pAsb.positionPc = remainPosition.positionPc
    pAsb.sizePc = remainPosition.sizePc
    asb.belongs.push(pAsb)
  }
  deletePAssembly = (asb, pAsb) => {
    const belongs = asb.belongs.reduce((ev, belong) => {
      if (belong.id !== pAsb.id) {
        ev.push(belong)
      }
      return ev
    }, [])
    asb.belongs = belongs
    return asb
  }
  turnToBelowAssembly = (asb, turnAsb) => {
    const { dom } = this.DATA
    turnAsb.highLevelAssembly = asb
    const offsetP = turnAsb.turnSetting.offsetPosition

    let positionX = 0
    let positionY = 0
    // if ((asb.position.x - offsetP.x) > 0 && (asb.position.x - offsetP.x) < dom.canvas.width) {
    //   positionX = (asb.position.x - offsetP.x)
    // }
    // if ((asb.position.x - offsetP.x) > dom.canvas.width) {
    //   positionX = dom.canvas.width
    // }
    // if ((_position.y - size.height / 2) > 0 && (_position.y - size.height / 2) < dom.canvas.height) {
    //   positionY = (_position.y - size.height / 2)
    // }
    // if ((_position.y - size.height / 2) > dom.canvas.height) {
    //   positionY = dom.canvas.height
    // }
    let shouldPositionX = 0
    let shouldPositionY = 0
    if (offsetP.x > 0) {
      shouldPositionX = asb.position.x - offsetP.x - Math.floor(Math.random() * 60)
      shouldPositionY = asb.position.y - offsetP.y - Math.floor(Math.random() * 60)
    }
    if (offsetP.x <= 0) {
      shouldPositionX = asb.position.x + asb.size.width - offsetP.x - Math.floor(Math.random() * 60)
      shouldPositionY = asb.position.y + asb.size.height - offsetP.y - Math.floor(Math.random() * 60)
    }
    if (shouldPositionX > 0 && shouldPositionX < dom.canvas.width) {
      positionX = shouldPositionX
    }
    if (shouldPositionX > dom.canvas.width) {
      positionX = dom.canvas.width - turnAsb.size.width / 2
    }
    if (shouldPositionY > 0 && shouldPositionY < dom.canvas.height) {
      positionY = shouldPositionY
    }
    if (shouldPositionY > dom.canvas.height) {
      positionY = dom.canvas.height - turnAsb.size.height / 2
    }

    turnAsb.position = {
      x: positionX,
      y: positionY,
    }
    turnAsb.positionPc = {
      x: positionX,
      y: positionY,
    }
    asb.belowLevelAssembly.push(turnAsb)
  }
  updatePosition = (asb, position) => {
    const { device } = this.DATA
    if (device === 'mobile') {
      asb.position = {
        x: position.x - asb.size.width / 2,
        y: position.y - asb.size.height / 2
      }
    } else if (device === 'pc') {
      asb.positionPc = {
        x: position.x - asb.sizePc.width / 2,
        y: position.y - asb.sizePc.height / 2
      }
    }
  }
  updateSize = (asb, size) => {
    const { device } = this.DATA
    if (device === 'mobile') {
      asb.size.width = size.width
      asb.size.height = size.height
    }
    if (device === 'pc') {
      asb.sizePc.width = size.width
      asb.sizePc.height = size.height
    }
  }
  addFromLine = (fromAsb, line) => {
    fromAsb.lines.from.push({ id: line.id, line })
  }
  addToLine = (toAsb, line) => {
    toAsb.lines.to.push({ id: line.id, line })
  }
  updateStatus = (asm, status) => {
    asm.status = status
  }
}
