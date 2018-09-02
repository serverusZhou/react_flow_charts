import UUID from 'uuid'
import util from './util'
import { drawAImage } from './draw/drawUtil'

function checkIsBelongPosition (point, belongPoints) {
  return point.x > belongPoints.x && point.x < belongPoints.endX && point.y > belongPoints.y && point.y < belongPoints.endY
}
function checkIsBelongLine (point, from, to, fromSize, toSize) {
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
  const pLength = Math.sqrt(Math.pow(point.x - from.x, 2) + Math.pow(point.y - from.y, 2))
  const angle = Math.asin((to.y - from.y) / length)
  const pointAngle = Math.asin((point.y - from.y) / pLength)
  // 以from为原点
  const transTo = { x: length, y: 0 }
  const transPoint = {
    x: pLength * Math.cos(angle - pointAngle),
    y: pLength * Math.sin(angle - pointAngle)
  }
  const rule = length / 20 > 10 ? length / 20 : 10
  return Math.abs(transPoint.y) < rule && (transPoint.x < (transTo.x - Math.sqrt(Math.pow(toSize.width, 2) + Math.pow(toSize.height, 2)) / 2) && transPoint.x > Math.sqrt(Math.pow(fromSize.width, 2) + Math.pow(fromSize.height, 2)) / 2)
}

function checkIsBelongBrokenLine (point, allPoints, fromSize, toSize) {
  let isBelong = false
  let belongIndex = 0
  for (let i = 0; i < allPoints.length - 1; i++) {
    let beginSize = { width: 0, height: 0 }
    let endSize = { width: 0, height: 0 }
    if (i === 0) {
      beginSize = fromSize
    }
    if (i === allPoints.length - 2) {
      endSize = toSize
    }
    if (checkIsBelongLine(point, allPoints[i], allPoints[i + 1], beginSize, endSize)) {
      isBelong = true
      belongIndex = i
    }
  }
  return {
    isBelong,
    belongIndex
  }
}

function checkIsNearAPosition (position, points, distence = 10) {
  let nearIndex = NaN
  points.forEach((point, index) => {
    if (Math.abs(point.x - position.x) < distence && Math.abs(point.y - position.y) < distence) {
      nearIndex = index
    }
  })
  return nearIndex
}

function getPosition(obj) {
  let l = 0
  let t = 0
  while (obj) {
    l += obj.offsetLeft
    t += obj.offsetTop
    obj = obj.offsetParent
  }
  return { left: l, top: t }
}

function getScrollTop() {
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

function imageRatio(imgUrl) {
  const image = new Image()
  image.src = imgUrl
  return image.height / image.width
}

export default function(oprateData) {
  return {
    transPixelToPos: function(pixel) {
      const { dom } = oprateData
      const canvasPosition = getPosition(dom.canvas)
      const scrollTop = getScrollTop()
      return {
        x: (pixel.x - canvasPosition.left) / dom.canvas.offsetWidth * 1000,
        y: (pixel.y - canvasPosition.top + scrollTop) / dom.canvas.offsetWidth * 1000
      }
    },
    addAssmbly: function(assembly, position) {
      const { assemblies, material, device } = oprateData
      const size = (function() {
        let width = (material.assemblies[assembly].size && material.assemblies[assembly].size.width) || 100
        let height = (material.assemblies[assembly].size && material.assemblies[assembly].size.height) || 100
        return {
          width: (device === 'mobile') ? width * 2 : width,
          height: (device === 'mobile') ? height * 2 : height
        }
      })()
      assemblies.push({
        id: UUID(),
        name: material.assemblies[assembly].assemblyName,
        assemblyName: assembly,
        imageUrl: material.assemblies[assembly].imageUrl,
        position: {
          x: position.x - size.width / 2,
          y: position.y - size.height / 2,
        },
        size: {
          width: size.width,
          height: size.height
        },
        insizeSpacePercent: material.assemblies[assembly].insizeSpacePercent,
        lines: {
          from: [],
          to: []
        },
        belongs: [],
        draw: material.assemblies[assembly].draw ? material.assemblies[assembly].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        },
        acturalData: {}
      })
    },
    addPAssmbly: function(parasiticAssembly, position) {
      const { assemblies, material, parasiticAssemblies } = oprateData
      const belongToAssembly = assemblies.find(element => checkIsBelongPosition(position, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      }))
      if (belongToAssembly && Object.keys(belongToAssembly)) {
        const ratio = imageRatio(material.parasiticAssemblies[parasiticAssembly].imageUrl)
        const remainPosition = belongToAssembly.belongs.reduce((ev, belong) => {
          if (belong.isOccupyInternalSpace) {
            ev.position.y = ev.position.y - belong.size.height
          }
          return ev
        }, { position: {
          x: belongToAssembly.position.x + belongToAssembly.insizeSpacePercent[3] * belongToAssembly.size.width,
          y: belongToAssembly.position.y + belongToAssembly.size.height - belongToAssembly.insizeSpacePercent[2] * belongToAssembly.size.height - belongToAssembly.size.width * (1 - belongToAssembly.insizeSpacePercent[1] - belongToAssembly.insizeSpacePercent[3]) * ratio,
        }, size: {
          width: belongToAssembly.size.width * (1 - belongToAssembly.insizeSpacePercent[1] - belongToAssembly.insizeSpacePercent[3]),
          height: belongToAssembly.size.width * (1 - belongToAssembly.insizeSpacePercent[1] - belongToAssembly.insizeSpacePercent[3]) * ratio
        }})
        const addParasiticAssembly = {
          id: UUID(),
          name: material.parasiticAssemblies[parasiticAssembly].assemblyName,
          assemblyName: parasiticAssembly,
          imageUrl: material.parasiticAssemblies[parasiticAssembly].imageUrl,
          belongsTo: belongToAssembly,
          ratio: imageRatio(material.parasiticAssemblies[parasiticAssembly].imageUrl),
          isOccupyInternalSpace: material.parasiticAssemblies[parasiticAssembly].isOccupyInternalSpace,
          acturalData: {},
          ...remainPosition
        }
        parasiticAssemblies.push(addParasiticAssembly)
        belongToAssembly.belongs.push(addParasiticAssembly)
      }
    },
    chooseAssmbly: function(position) {
      const { assemblies, choosenAssembly } = oprateData
      util.clearObj(choosenAssembly)
      let assembly = null
      assemblies.forEach(element => {
        if (checkIsBelongPosition(position, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          choosenAssembly[element.id] = true
          assembly = element
        }
      })
      return assembly
    },
    chooseLine: function(position) {
      const { lines, choosenLine } = oprateData
      util.clearObj(choosenLine)
      let chooseLine = null
      lines.forEach(line => {
        const allPoints = [{ ...line.from.position }].concat(line.middlePoints).concat({ ...line.to.position })
        if (checkIsBelongBrokenLine(position, allPoints, line.from.assembly.size, line.to.assembly.size).isBelong) {
          choosenLine[line.id] = true
          chooseLine = line
        }
      })
      return chooseLine
    },
    updateChoosenAssemblyActuralData: function(acturalData) {
      const { assemblies, choosenAssembly } = oprateData
      assemblies.forEach(element => {
        if (choosenAssembly[element.id]) {
          element.acturalData = acturalData
        }
      })
    },
    findAssmblyByPosition: function(position) {
      const { assemblies } = oprateData
      return assemblies.find(element => {
        return checkIsBelongPosition(position, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })
      })
    },
    addAbleMoveAssembly: function(position) {
      const { assemblies, ableMoveAssembly } = oprateData
      util.clearObj(ableMoveAssembly)
      assemblies.forEach(element => {
        if (checkIsBelongPosition(position, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          ableMoveAssembly[element.id] = true
        }
      })
    },
    addAbleAddPointLine: function(position) {
      const { ableAddPointLine, lines } = oprateData
      util.clearObj(ableAddPointLine)
      let findLine = null
      let findNum = 0
      lines.forEach(line => {
        const allPoints = [{ ...line.from.position }].concat(line.middlePoints).concat({ ...line.to.position })
        const belongObj = checkIsBelongBrokenLine(position, allPoints, line.from.assembly.size, line.to.assembly.size)
        if (belongObj.isBelong) {
          findLine = line
          findNum = belongObj.belongIndex
        }
      })
      if (findLine && Object.keys(findLine)) {
        ableAddPointLine[findLine.id] = {
          positionAtLine: position,
          belongIndex: findNum
        }
        return true
      }
    },
    updateAssemblyPosition: function(position) {
      const { assemblies, ableMoveAssembly } = oprateData
      const moveAssembly = assemblies.find(element => ableMoveAssembly[element.id])
      if (!moveAssembly) { return }
      moveAssembly.position = {
        x: position.x - moveAssembly.size.width / 2,
        y: position.y - moveAssembly.size.height / 2
      }
      moveAssembly.lines.from.forEach(line => {
        line.line.from.position.x = position.x
        line.line.from.position.y = position.y
      })
      moveAssembly.lines.to.forEach(line => {
        line.line.to.position.x = position.x
        line.line.to.position.y = position.y
      })
      this.updatePAssemblyPosition(moveAssembly)

      // assemblies.forEach(element => {
      //   if (ableMoveAssembly[element.id]) {
      //     element.position = {
      //       x: position.x - element.size.width / 2,
      //       y: position.y - element.size.height / 2
      //     }
      //     element.lines.from.forEach(line => {
      //       line.line.from.position.x = position.x
      //       line.line.from.position.y = position.y
      //     })
      //     element.lines.to.forEach(line => {
      //       line.line.to.position.x = position.x
      //       line.line.to.position.y = position.y
      //     })
      //   }
      // })
    },

    updateLinePositions: function(position) {
      const { lines, ableAddPointLine } = oprateData
      const line = lines.find(line => !!ableAddPointLine[line.id])
      const allPoints = [{ ...line.from.position }].concat(line.middlePoints).concat({ ...line.to.position })
      const checkObj = checkIsBelongBrokenLine(position, allPoints, line.from.assembly.size, line.to.assembly.size)
      if (!checkObj.isBelong) {
        const _num = checkIsNearAPosition(ableAddPointLine[line.id].positionAtLine, allPoints)
        if (isNaN(_num)) {
          line.middlePoints.splice(ableAddPointLine[line.id].belongIndex, 0, position)
        } else {
          line.middlePoints[_num - 1 ] = position
        }
      }
    },
    updatePAssemblyPosition: function(assembly) {
      let lessHeight = 0
      assembly.belongs.forEach(belong => {
        const updateInfo = {
          position: {
            x: assembly.position.x + assembly.insizeSpacePercent[3] * assembly.size.width,
            y: assembly.position.y + assembly.size.height - assembly.insizeSpacePercent[2] * assembly.size.height - assembly.size.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]) * belong.ratio - lessHeight,
          }, size: {
            width: assembly.size.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]),
            height: assembly.size.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]) * belong.ratio
          }
        }
        lessHeight = lessHeight + assembly.size.width * (1 - assembly.insizeSpacePercent[1] - assembly.insizeSpacePercent[3]) * belong.ratio
        belong.position = updateInfo.position
        belong.size = updateInfo.size
      })
    },
    showHoverAssembly: function() {
      const that = this
      const { hoverAssembly } = oprateData
      return (position) => {
        const assembly = that.findAssmblyByPosition(position)
        if (!assembly) {
          util.clearObj(hoverAssembly)
          return
        }
        util.clearObj(hoverAssembly)
        hoverAssembly[assembly.id] = true
      }
    },
    setActiveLine: function(lineType) {
      let { mode, activeLine } = oprateData
      if (activeLine[lineType]) {
        mode.setTo('assembly')
        util.clearObj(activeLine)
      } else {
        mode.setTo('line')
        util.clearObj(activeLine)
        activeLine[lineType] = true
      }
    },
    addTemLine: function(position) {
      const fromAssembly = this.findAssmblyByPosition(position)
      if (fromAssembly && Object.keys(fromAssembly).length) {
        const { temLine, material, activeLine } = oprateData
        temLine.id = UUID()
        temLine.type = Object.keys(activeLine)[0]
        temLine.from = {
          assembly: fromAssembly,
          position: {
            x: fromAssembly.position.x + fromAssembly.size.width / 2,
            y: fromAssembly.position.y + fromAssembly.size.height / 2,
          }
        }
        temLine.to = {
          assembly: null,
          position: {
            x: fromAssembly.position.x + fromAssembly.size.width / 2,
            y: fromAssembly.position.y + fromAssembly.size.height / 2,
          }
        }
        temLine.middlePoints = []
        temLine.draw = material.lines[Object.keys(activeLine)[0]].draw()
      }
    },
    addLine: function(assembly) {
      const { temLine, lines } = oprateData
      const alreadyHasLine = lines.some(line => {
        return (line.from.assembly.id === temLine.from.assembly.id && line.to.assembly.id === assembly.id) || (line.to.assembly.id === temLine.from.assembly.id && line.from.assembly.id === assembly.id)
      })
      if (alreadyHasLine) {
        console.log('已经存在了---------------')
        return
      }
      if (temLine.from.assembly.id === assembly.id) {
        console.log('回到了原点了---------------')
        return
      }
      temLine.to.position = {
        x: assembly.position.x + assembly.size.width / 2,
        y: assembly.position.y + assembly.size.height / 2,
      }
      temLine.to.assembly = assembly
      const cloneLine = Object.assign({}, temLine)
      temLine.from.assembly.lines.from.push({
        id: temLine.id,
        line: cloneLine
      })
      temLine.to.assembly.lines.to.push({
        id: temLine.id,
        line: cloneLine
      })
      lines.push(cloneLine)
    },
    moveTemLine: function(position) {
      const { temLine } = oprateData
      temLine.to.position = {
        ...position
      }
    },
    narrowAssembly: function() {
      const { choosenAssembly, assemblies } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        const aTAssembly = assemblies.find(element => choosenAssembly[element.id])
        if (!aTAssembly) return
        aTAssembly.size.width = aTAssembly.size.width / 1.1
        aTAssembly.size.height = aTAssembly.size.height / 1.1
        this.updatePAssemblyPosition(aTAssembly)
      }
    },
    enlargeAssembly: function() {
      const { choosenAssembly, assemblies } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        const aTAssembly = assemblies.find(element => choosenAssembly[element.id])
        if (!aTAssembly) return
        aTAssembly.size.width = aTAssembly.size.width * 1.1
        aTAssembly.size.height = aTAssembly.size.height * 1.1
        this.updatePAssemblyPosition(aTAssembly)
      }
    },
    deleteAssembly: function() {
      const { choosenAssembly, assemblies, parasiticAssemblies, lines } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        assemblies.forEach((element, index) => {
          if (choosenAssembly[element.id]) {
            oprateData.lines = lines.filter(line => {
              return !element.lines.from.some(fromLine => line.id === fromLine.id) && !element.lines.to.some(fromLine => line.id === fromLine.id)
            })
            oprateData.parasiticAssemblies = parasiticAssemblies.filter(parasiticAssembly => {
              return !element.belongs.some(belong => belong.id === parasiticAssembly.id)
            })
            assemblies.splice(index, 1)
          }
        })
      }
    },
    deleteLine: function() {
      const { choosenLine, lines, mode } = oprateData
      if (choosenLine && Object.keys(choosenLine).length) {
        lines.forEach((line, index) => {
          if (choosenLine[line.id]) {
            line.from.assembly.lines.from.forEach((fromLine, fromLineIndex) => {
              if (line.id === fromLine.id) {
                line.from.assembly.lines.from.splice(fromLineIndex, 1)
              }
            })
            line.to.assembly.lines.to.forEach((toLine, toLineIndex) => {
              if (line.id === toLine.id) {
                line.to.assembly.lines.to.splice(toLineIndex, 1)
              }
            })
            lines.splice(index, 1)
          }
        })
      }
      util.clearObj(choosenLine)
      mode.setTo('assembly')
    },
    resetAssembliesAndLines: function(assemblies, lines, parasiticAssemblies) {
      const { material } = oprateData
      assemblies.forEach(assembly => {
        assembly.draw = material.assemblies[assembly.assemblyName].draw ? material.assemblies[assembly.assemblyName].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        }
      })
      lines.forEach(line => {
        line.draw = material.lines[line.type].draw()
      })
      return {
        assemblies,
        lines,
        parasiticAssemblies
      }
    }
  }
}
