import UUID from 'uuid'
import setting from './defaltSettings'

export default class LineMethod {
  constructor(data) {
    this.DATA = data
  }
  add = (_fromAsb, _toAsb) => {
    const { lines, activeLine, material } = this.DATA
    let lineType = ''
    if (activeLine && Object.keys(activeLine).length) {
      lineType = Object.keys(activeLine)[0]
    } else {
      lineType = Object.keys(material.lines)[0]
    }
    const addLine = {
      ...setting.lineSetting,
      id: UUID(),
      type: lineType,
      from: {
        assembly: _fromAsb,
        position: {
          x: _fromAsb.position.x + _fromAsb.size.width / 2,
          y: _fromAsb.position.y + _fromAsb.size.height / 2,
        },
        positionPc: {
          x: _fromAsb.positionPc.x + _fromAsb.sizePc.width / 2,
          y: _fromAsb.positionPc.y + _fromAsb.sizePc.height / 2,
        }
      },
      to: {
        assembly: _toAsb,
        position: {
          x: _toAsb.position.x + _toAsb.size.width / 2,
          y: _toAsb.position.y + _toAsb.size.height / 2,
        },
        positionPc: {
          x: _toAsb.positionPc.x + _toAsb.sizePc.width / 2,
          y: _toAsb.positionPc.y + _toAsb.sizePc.height / 2,
        }
      },
      state: 'normal',
      draw: material.lines[lineType].draw(),
      drawChoosen: material.lines[lineType].drawChoosen ? material.lines[lineType].drawChoosen() : null
    }
    lines.push(addLine)
    return addLine
  }
  changeType = (line, type) => {
    const { lines, material } = this.DATA
    if (Object.keys(material.lines).includes(type)) {
      const aTLine = lines.find(l => l.id === line.id)
      if (aTLine) {
        aTLine.type = type
        aTLine.draw = material.lines[type].draw()
        return aTLine
      }
    }
  }
  resetLinesPosition = (lines) => {
    const { device } = this.DATA
    if (device === 'mobile') {
      lines.forEach(element => {
        const { position: _fPosition, assembly: _fAssembly } = element.line.from
        const { position: _tPosition, assembly: _tAssembly } = element.line.to
        _fPosition.x = _fAssembly.position.x + 1 / 2 * _fAssembly.size.width
        _fPosition.y = _fAssembly.position.y + 1 / 2 * _fAssembly.size.height
        _tPosition.x = _tAssembly.position.x + 1 / 2 * _tAssembly.size.width
        _tPosition.y = _tAssembly.position.y + 1 / 2 * _tAssembly.size.height
      })
    }
    if (device === 'pc') {
      lines.forEach(element => {
        const { positionPc: _fPosition, assembly: _fAssembly } = element.line.from
        const { positionPc: _tPosition, assembly: _tAssembly } = element.line.to
        _fPosition.x = _fAssembly.positionPc.x + 1 / 2 * _fAssembly.sizePc.width
        _fPosition.y = _fAssembly.positionPc.y + 1 / 2 * _fAssembly.sizePc.height
        _tPosition.x = _tAssembly.positionPc.x + 1 / 2 * _tAssembly.sizePc.width
        _tPosition.y = _tAssembly.positionPc.y + 1 / 2 * _tAssembly.sizePc.height
      })
    }
  }
  updateLineState = (line, state) => {
    const { lines } = this.DATA
    const rightLine = lines.find(l => l.id === line.id)
    if (rightLine) {
      rightLine.state = state
      return rightLine
    }
  }
  addMiddlePoint = (line, point) => {
    const { lines, device } = this.DATA
    const rightLine = lines.find(l => l.id === line.id)
    if (device === 'mobile') {
      rightLine.middlePoints.push(point)
    }
    if (device === 'pc') {
      rightLine.middlePointsPc.push(point)
    }
  }
}
