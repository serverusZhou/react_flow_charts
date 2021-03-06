import UUID from 'uuid'
import util from './util'
import { drawAImage } from './draw/drawUtil'
import AssemblyMethod from './actions/assemblyMethod'
import WAssemblyMethod from './actions/wepperAssemblyMethod'
import PAssemblyMethod from './actions/parasiticAssemblyMethod'
import LineMethod from './actions/lineMethod'

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
  return Math.abs(transPoint.y) < rule &&
  (transPoint.x < (transTo.x - Math.sqrt(Math.pow(toSize.width, 2) + Math.pow(toSize.height, 2)) / 2) &&
  transPoint.x > Math.sqrt(Math.pow(fromSize.width, 2) + Math.pow(fromSize.height, 2)) / 2)
}

function checkIsBelongBrokenLine (point, allPoints, fromSize, toSize, isNearDistence = 6) {
  let isBelong = false
  let isNear = false
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
      if (Math.abs(allPoints[i].x - point.x) < isNearDistence && Math.abs(allPoints[i].y - point.y) < isNearDistence) {
        isNear = true
        belongIndex = i
      } else if (Math.abs(allPoints[i + 1].x - point.x) < isNearDistence && Math.abs(allPoints[i + 1].x - point.x) < isNearDistence) {
        isNear = true
        belongIndex = i + 1
      } else {
        belongIndex = i
      }
    }
  }
  return {
    isBelong,
    belongIndex,
    isNear,
  }
}

// function checkIsNearAPosition (position, points, distence = 20) {
//   let nearIndex = NaN
//   points.forEach((point, index) => {
//     if (Math.abs(point.x - position.x) < distence && Math.abs(point.y - position.y) < distence) {
//       nearIndex = index
//     }
//   })
//   return nearIndex
// }

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

function checkoutIsOutBox(insideBox, outsideBox) {
  return insideBox[0].x > outsideBox[1].x || insideBox[1].x < outsideBox[0].x || insideBox[0].y > outsideBox[1].y || insideBox[1].y < outsideBox[0].y
}

function checkIsThreePointsLine(point1, point2, point3) {
  const angle1 = Math.atan((point2.y - point1.y) / (point2.x - point1.x))
  const angle2 = Math.atan((point3.y - point2.y) / (point3.x - point2.x))
  return Math.abs(angle2 - angle1) < 0.15
}

export default function(oprateData) {
  const assemblyAction = new AssemblyMethod(oprateData)
  const wAssemblyAction = new WAssemblyMethod(oprateData)
  const pAssemblyAction = new PAssemblyMethod(oprateData)
  const lineAction = new LineMethod(oprateData)
  return {
    transPixelToPos: function(pixel) {
      const pixelMap = {
        'pc': { width: 2500, height: 2500 },
        'mobile': { width: 1000, height: 1000 }
      }
      const { dom, device } = oprateData
      const canvasPosition = getPosition(dom.canvas)
      const scrollTop = getScrollTop()
      return {
        x: (pixel.x - canvasPosition.left) / dom.canvas.offsetWidth * pixelMap[device].width,
        y: (pixel.y - canvasPosition.top + scrollTop) / dom.canvas.offsetWidth * pixelMap[device].height
      }
    },
    getAssemblyAtPos: function(position) {
      const { assemblies } = oprateData
      return assemblies.find(element => checkIsBelongPosition(position, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      }) && element.assemblyName !== 'wapperAssembly')
    },
    getWAssemblyAtPos: function(position) {
      const { assemblies } = oprateData
      return assemblies.find(element => checkIsBelongPosition(position, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      }) && element.assemblyName === 'wapperAssembly')
    },
    
    addAssmbly: function(assembly, position) {
      if (assembly === 'wapperAssembly') { return wAssemblyAction.add(assembly, position) }
      const addedAss = assemblyAction.add(assembly, position)
      const aTWAssembly = this.getWAssemblyAtPos(position)
      if (aTWAssembly) {
        addedAss.wapper = wapperAssembly
        aTWAssembly.children.push(addedAss)
        wAssemblyAction.reLayout(aTWAssembly)
      }
    },
    addPAssmbly: function(parasiticAssembly, position, displayName, acturalData) {
      const { material } = oprateData
      const belongToAssembly = this.getAssemblyAtPos(position)
      if (belongToAssembly) {
        if (material.parasiticAssemblies[parasiticAssembly].isPAndA) {
          this.toTurnAddAssembly(belongToAssembly, material.parasiticAssemblies[parasiticAssembly], parasiticAssembly, displayName, acturalData)
          return
        }
        const addedPassembly = pAssemblyAction.add(parasiticAssembly, belongToAssembly)
        assemblyAction.addPAssembly(belongToAssembly, addedPassembly)
        return addedPassembly
      }
    },
    toTurnAddAssembly: function(belongToAssembly, belong, belongName, displayName, acturalData) {
      const turnedAssembly = assemblyAction.addWithoutKey({
        id: UUID(),
        name: belong.assemblyName,
        assemblyName: belongName,
        imageUrl: belong.imageUrl,
        image: util.getImage(belong.imageUrl),
        size: { width: belong.size.width, height: belong.size.height },
        sizePc: { width: belong.size.width, height: belong.size.height },
        displayName,
        typeBelong: belong.typeBelong,
        turnSetting: {
          offsetPosition: belong.offsetPosition
        },
        draw: belong.draw(),
        initData: belong.initData,
        acturalData: acturalData || {}
      })
      assemblyAction.turnToBelowAssembly(belongToAssembly, turnedAssembly)
      const addedLine = lineAction.add(belong.isTo ? belongToAssembly : turnedAssembly, belong.isTo ? turnedAssembly : belongToAssembly)
      assemblyAction.addFromLine(belong.isTo ? belongToAssembly : turnedAssembly, addedLine)
      assemblyAction.addToLine(belong.isTo ? turnedAssembly : belongToAssembly, addedLine)
    },
    chooseAssmbly: function(position) {
      const { assemblies, choosenAssembly, actionBtns, ableMoveAssembly, device } = oprateData
      util.clearObj(choosenAssembly)
      actionBtns.enable = false
      let assembly = assemblies.find(element => {
        let APosition = {}; let ASize = {}
        if (device === 'mobile') {
          APosition = element.position
          ASize = element.size
        } else if (device === 'pc') {
          APosition = element.positionPc
          ASize = element.sizePc
        }
        return checkIsBelongPosition(position, {
          x: APosition.x,
          endX: APosition.x + ASize.width,
          y: APosition.y,
          endY: APosition.y + ASize.height,
        })
      })
      if (assembly) {
        if (assembly.assemblyName === 'wapperAssembly') {
          let childAss = assembly.children.find(element => {
            let APosition = {}; let ASize = {}
            if (device === 'mobile') {
              APosition = element.position
              ASize = element.size
            } else if (device === 'pc') {
              APosition = element.positionPc
              ASize = element.sizePc
            }
            return checkIsBelongPosition(position, {
              x: APosition.x,
              endX: APosition.x + ASize.width,
              y: APosition.y,
              endY: APosition.y + ASize.height,
            })
          })
          if (childAss) {
            choosenAssembly[childAss.id] = true
          } else {
            choosenAssembly[assembly.id] = true
          }
        } else {
          choosenAssembly[assembly.id] = true
        }
        actionBtns.enable = true
        util.clearObj(ableMoveAssembly)
        this.updateActionBtnPosition()
      }
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
          element.acturalData = {
            ...element.acturalData,
            ...acturalData,
          }
        }
      })
    },
    updateAsmActuralData: function(asm, acturalData) {
      asm.acturalData = {
        ...asm.acturalData,
        ...acturalData,
      }
    },
    updatePAssemblyActuralData: function(pAssembly, acturalData) {
      pAssemblyAction.updateActuralData(pAssembly, acturalData)
    },
    dealWithPAssemblyAction: function(position) {
      const { parasiticAssemblies, ableMovePAssembly, assemblies, choosenAssembly } = oprateData
      const movePAssembly = parasiticAssemblies.find(pAssembly => ableMovePAssembly[pAssembly.id])
      const choosenA = assemblies.find(assembly => choosenAssembly[assembly.id])
      if (movePAssembly && Object.keys(movePAssembly).length) {
        if (checkoutIsOutBox([
          { x: movePAssembly.position.x, y: movePAssembly.position.y },
          { x: movePAssembly.position.x + movePAssembly.size.width, y: movePAssembly.position.y + movePAssembly.size.height }
        ], [
          { x: choosenA.position.x, y: choosenA.position.y },
          { x: choosenA.position.x + choosenA.size.width, y: choosenA.position.y + choosenA.size.height }
        ])) {
          oprateData.parasiticAssemblies = parasiticAssemblies.filter(pAssembly => pAssembly.id !== movePAssembly.id)
          choosenA.belongs = choosenA.belongs.filter(belong => belong.id !== movePAssembly.id)
        }
        assemblyAction.reLayoutPAssemblies(choosenA)
      }
    },
    findAssmblyByPosition: function(position) {
      const { assemblies, device } = oprateData
      return assemblies.find(element => {
        let APosition = {}; let ASize = {}
        if (device === 'mobile') {
          APosition = element.position
          ASize = element.size
        } else if (device === 'pc') {
          APosition = element.positionPc
          ASize = element.sizePc
        }
        return checkIsBelongPosition(position, {
          x: APosition.x,
          endX: APosition.x + ASize.width,
          y: APosition.y,
          endY: APosition.y + ASize.height,
        })
      })
    },
    addAbleMoveAssembly: function(position) {
      const { assemblies, ableMoveAssembly, device } = oprateData
      util.clearObj(ableMoveAssembly)
      assemblies.forEach(element => {
        let APosition = {}; let ASize = {}
        if (device === 'mobile') {
          APosition = element.position
          ASize = element.size
        } else if (device === 'pc') {
          APosition = element.positionPc
          ASize = element.sizePc
        }
        if (checkIsBelongPosition(position, {
          x: APosition.x,
          endX: APosition.x + ASize.width,
          y: APosition.y,
          endY: APosition.y + ASize.height,
        })) {
          ableMoveAssembly[element.id] = true
        }
      })
    },
    addAbleMovePAssembly: function(position) {
      const { parasiticAssemblies, ableMovePAssembly, device } = oprateData
      const pAssembly = parasiticAssemblies.find(element => {
        let APosition = {}; let ASize = {}
        if (device === 'mobile') {
          APosition = element.position
          ASize = element.size
        } else if (device === 'pc') {
          APosition = element.positionPc
          ASize = element.sizePc
        }
        return checkIsBelongPosition(position, {
          x: APosition.x,
          endX: APosition.x + ASize.width,
          y: APosition.y,
          endY: APosition.y + ASize.height,
        })
      })
      if (pAssembly) { ableMovePAssembly[pAssembly.id] = true; return true }
    },
    addAbleMoveDragingPoint: function(position) {
      const { actionBtns, ableDrafPoint, device } = oprateData
      const draftingPoint = actionBtns.draftingPoints.find(point => {
        let APosition = {}; let ASize = {}
        if (device === 'mobile') {
          APosition = point.position
          ASize = point.size
        } else if (device === 'pc') {
          APosition = point.positionPc
          ASize = point.sizePc
        }
        return checkIsBelongPosition(position, {
          x: APosition.x,
          endX: APosition.x + ASize.width,
          y: APosition.y,
          endY: APosition.y + ASize.height,
        })
      })
      if (draftingPoint && Object.keys(draftingPoint).length) {
        ableDrafPoint[draftingPoint.type] = true
      }
    },
    addAbleAddPointLine: function(position) {
      const { ableAddPointLine, lines, device } = oprateData
      util.clearObj(ableAddPointLine)
      let findLine = null
      let findNum = 0
      if (device === 'mobile') {
        lines.forEach(line => {
          const allPoints = [{ ...line.from.position }].concat(line.middlePoints).concat({ ...line.to.position })
          const belongObj = checkIsBelongBrokenLine(position, allPoints, line.from.assembly.size, line.to.assembly.size)
          if (belongObj.isBelong) {
            findLine = line
            findNum = belongObj.belongIndex
            if (belongObj.isNear && findNum !== 0 && findNum !== line.middlePoints.length + 1) {
              findNum--
              line.middlePoints[findNum] = position
            } else if (findNum === 1 && findNum === line.middlePoints.length + 1) {
              findNum = 0
              line.middlePoints.splice(findNum, 0, position)
            } else {
              line.middlePoints.splice(findNum, 0, position)
            }
          }
        })
      }
      if (device === 'pc') {
        lines.forEach(line => {
          const allPoints = [{ ...line.from.positionPc }].concat(line.middlePointsPc).concat({ ...line.to.positionPc })
          const belongObj = checkIsBelongBrokenLine(position, allPoints, line.from.assembly.sizePc, line.to.assembly.sizePc)
          if (belongObj.isBelong) {
            findLine = line
            findNum = belongObj.belongIndex
            if (belongObj.isNear && findNum !== 0 && findNum !== line.middlePointsPc.length + 1) {
              findNum--
              line.middlePointsPc[findNum] = position
            } else if (findNum === 1 && findNum === line.middlePointsPc.length + 1) {
              findNum = 0
              line.middlePointsPc.splice(findNum, 0, position)
            } else {
              line.middlePointsPc.splice(findNum, 0, position)
            }
          }
        })
      }
      if (findLine && Object.keys(findLine).length) {
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
      if (!moveAssembly || moveAssembly.wapper) { return }
      assemblyAction.updatePosition(moveAssembly, position)
      lineAction.resetLinesPosition([...moveAssembly.lines.from, ...moveAssembly.lines.to])
      assemblyAction.reLayoutPAssemblies(moveAssembly)

      const wAssembly = this.getWAssemblyAtPos(position)
      if (wAssembly && Object.keys(wAssembly) && moveAssembly.assemblyName !== 'wapperAssembly') {
        moveAssembly.wapper = wAssembly
        if (!wAssembly.children.find(child => child.id === moveAssembly.id)) {
          wAssembly.children.push(moveAssembly)
        }
        wAssemblyAction.reLayout(wAssembly)
      }
      if (moveAssembly.assemblyName === 'wapperAssembly') {
        wAssemblyAction.reLayout(moveAssembly)
      }
    },
    updateChoosenAssemblyPosition: function(position) {
      const { assemblies, choosenAssembly } = oprateData
      const choosenAsm = assemblies.find(element => choosenAssembly[element.id])
      if (!choosenAsm || choosenAsm.wapper) { return }
      assemblyAction.updatePosition(choosenAsm, position)
      lineAction.resetLinesPosition([...choosenAsm.lines.from, ...choosenAsm.lines.to])
      assemblyAction.reLayoutPAssemblies(choosenAsm)

      const wAssembly = this.getWAssemblyAtPos(position)
      if (wAssembly && Object.keys(wAssembly) && wAssembly.assemblyName === 'wapperAssembly' && choosenAsm.assemblyName !== 'wapperAssembly') {
        choosenAsm.wapper = wAssembly
        if (!wAssembly.children.find(child => child.id === choosenAsm.id)) {
          wAssembly.children.push(choosenAsm)
        }
        wAssemblyAction.reLayout(wAssembly)
      }
      if (choosenAsm.assemblyName === 'wapperAssembly') {
        wAssemblyAction.reLayout(choosenAsm)
      }
    },
    updateChoosenAssemblySize: function(size) {
      const { assemblies, choosenAssembly } = oprateData
      const choosenAsm = assemblies.find(element => choosenAssembly[element.id])
      assemblyAction.updateSize(choosenAsm, size)
    },
    updatePAssemblyPosition: function(position) {
      const { parasiticAssemblies, ableMovePAssembly, device } = oprateData
      const movePAssembly = parasiticAssemblies.find(element => ableMovePAssembly[element.id])
      if (!movePAssembly) { return }
      if (device === 'mobile') {
        movePAssembly.position = {
          x: position.x - movePAssembly.size.width / 2,
          y: position.y - movePAssembly.size.height / 2
        }
      } else if (device === 'pc') {
        movePAssembly.positionPc = {
          x: position.x - movePAssembly.sizePc.width / 2,
          y: position.y - movePAssembly.sizePc.height / 2
        }
      }
    },
    updateDrafPointPosition: function(position) {
      const { assemblies, choosenAssembly, actionBtns, ableDrafPoint, device } = oprateData
      const aTAssembly = assemblies.find(assembly => choosenAssembly[assembly.id])
      const draftingPoint = actionBtns.draftingPoints.find(point => ableDrafPoint[point.type])
      if (!draftingPoint) { return }
      if (device === 'mobile') {
        if (draftingPoint.type === 'topLeft') {
          aTAssembly.size = {
            width: aTAssembly.size.width - (position.x - aTAssembly.position.x),
            height: aTAssembly.size.height - (position.y - aTAssembly.position.y),
          }
          aTAssembly.position = position
        }
        if (draftingPoint.type === 'topRight') {
          aTAssembly.size = {
            width: position.x - aTAssembly.position.x,
            height: aTAssembly.size.height - (position.y - aTAssembly.position.y),
          }
          aTAssembly.position = {
            x: aTAssembly.position.x,
            y: position.y
          }
        }
        if (draftingPoint.type === 'bottomLeft') {
          aTAssembly.size = {
            width: aTAssembly.size.width - (position.x - aTAssembly.position.x),
            height: position.y - aTAssembly.position.y,
          }
          aTAssembly.position = {
            y: aTAssembly.position.y,
            x: position.x
          }
        }
        if (draftingPoint.type === 'bottomRight') {
          aTAssembly.size = {
            width: position.x - aTAssembly.position.x,
            height: position.y - aTAssembly.position.y,
          }
        }
      }
      if (device === 'pc') {
        if (draftingPoint.type === 'topLeft') {
          aTAssembly.sizePc = {
            width: aTAssembly.sizePc.width - (position.x - aTAssembly.positionPc.x),
            height: aTAssembly.sizePc.height - (position.y - aTAssembly.positionPc.y),
          }
          aTAssembly.positionPc = position
        }
        if (draftingPoint.type === 'topRight') {
          aTAssembly.sizePc = {
            width: position.x - aTAssembly.positionPc.x,
            height: aTAssembly.sizePc.height - (position.y - aTAssembly.positionPc.y),
          }
          aTAssembly.positionPc = {
            x: aTAssembly.positionPc.x,
            y: position.y
          }
        }
        if (draftingPoint.type === 'bottomLeft') {
          aTAssembly.sizePc = {
            width: aTAssembly.sizePc.width - (position.x - aTAssembly.positionPc.x),
            height: position.y - aTAssembly.positionPc.y,
          }
          aTAssembly.positionPc = {
            y: aTAssembly.positionPc.y,
            x: position.x
          }
        }
        if (draftingPoint.type === 'bottomRight') {
          aTAssembly.sizePc = {
            width: position.x - aTAssembly.positionPc.x,
            height: position.y - aTAssembly.positionPc.y,
          }
        }
      }
      assemblyAction.reLayoutPAssemblies(aTAssembly)
      this.updateActionBtnPosition()
      if (aTAssembly.assemblyName === 'wapperAssembly') {
        wAssemblyAction.reLayout(aTAssembly)
      }
    },
    updateLinePositions: function(position) {
      const { lines, ableAddPointLine, device } = oprateData
      const line = lines.find(line => !!ableAddPointLine[line.id])
      if (line && Object.keys(line).length) {
        if (device === 'mobile') {
          line.middlePoints[ableAddPointLine[line.id].belongIndex] = position
        }
        if (device === 'pc') {
          line.middlePointsPc[ableAddPointLine[line.id].belongIndex] = position
        }
      }
    },
    setLinePositions: function(position) {
      const { lines, ableAddPointLine, device } = oprateData
      const line = lines.find(line => !!ableAddPointLine[line.id])
      if (device === 'mobile') {
        const allPoints = [line.from.position].concat(line.middlePoints).concat([line.to.position])
        if (checkIsThreePointsLine(
          allPoints[ableAddPointLine[line.id].belongIndex],
          allPoints[ableAddPointLine[line.id].belongIndex + 1],
          allPoints[ableAddPointLine[line.id].belongIndex + 2]
        )) {
          line.middlePoints.splice(ableAddPointLine[line.id].belongIndex, 1)
        } else {
          line.middlePoints[ableAddPointLine[line.id].belongIndex ] = position
        }
      }
      if (device === 'pc') {
        const allPoints = [line.from.positionPc].concat(line.middlePointsPc).concat([line.to.positionPc])
        if (checkIsThreePointsLine(
          allPoints[ableAddPointLine[line.id].belongIndex],
          allPoints[ableAddPointLine[line.id].belongIndex + 1],
          allPoints[ableAddPointLine[line.id].belongIndex + 2]
        )) {
          line.middlePointsPc.splice(ableAddPointLine[line.id].belongIndex, 1)
        } else {
          line.middlePointsPc[ableAddPointLine[line.id].belongIndex ] = position
        }
      }
    },
    updateActionBtnPosition: function() {
      const { assemblies, choosenAssembly, actionBtns, device } = oprateData
      const aTAssembly = assemblies.find(assembly => choosenAssembly[assembly.id])
      let position = {}; let size = {}
      if (device === 'pc') {
        position = aTAssembly.positionPc
        size = aTAssembly.sizePc
      } else if (device === 'mobile') {
        position = aTAssembly.position
        size = aTAssembly.size
      }
      actionBtns.position = {
        x: position.x,
        y: position.y - 30
      }
      actionBtns.size = {
        width: size.width,
        height: 30
      }
      actionBtns.btns.forEach((btn, index) => {
        btn.position = {
          x: position.x + index * 50,
          y: position.y - 50
        }
        btn.size = {
          width: 30,
          height: 30
        }
      })
      actionBtns.draftingPoints.forEach((draftingPoint, index) => {
        const map = {
          'topLeft': [0, 0],
          'topRight': [1, 0],
          'bottomLeft': [0, 1],
          'bottomRight': [1, 1],
        }
        if (device === 'pc') {
          draftingPoint.positionPc = {
            x: position.x - 10 + size.width * map[draftingPoint.type][0],
            y: position.y - 10 + size.height * map[draftingPoint.type][1]
          }
        }
        if (device === 'mobile') {
          draftingPoint.position = {
            x: position.x - 10 + size.width * map[draftingPoint.type][0],
            y: position.y - 10 + size.height * map[draftingPoint.type][1]
          }
        }
      })
    },
    showHoverAssembly: function() {
      const that = this
      const { hoverAssembly, dom } = oprateData
      return (position) => {
        const assembly = that.findAssmblyByPosition(position)
        if (!assembly) {
          util.clearObj(hoverAssembly)
          return
        }
        util.clearObj(hoverAssembly)
        hoverAssembly[assembly.id] = true
        dom.canvas.style.cursor = 'pointer'
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
          },
          positionPc: {
            x: fromAssembly.positionPc.x + fromAssembly.sizePc.width / 2,
            y: fromAssembly.positionPc.y + fromAssembly.sizePc.height / 2,
          }
        }
        temLine.to = {
          assembly: null,
          position: {
            x: fromAssembly.position.x + fromAssembly.size.width / 2,
            y: fromAssembly.position.y + fromAssembly.size.height / 2,
          },
          positionPc: {
            x: fromAssembly.positionPc.x + fromAssembly.sizePc.width / 2,
            y: fromAssembly.positionPc.y + fromAssembly.sizePc.height / 2,
          }
        }
        temLine.draw = material.lines[Object.keys(activeLine)[0]].draw()
      }
    },
    addLine: function(assembly) {
      const { temLine, lines } = oprateData
      const alreadyHasLine = lines.some(line => {
        return (line.from.assembly.id === temLine.from.assembly.id &&
          line.to.assembly.id === assembly.id) ||
          (line.to.assembly.id === temLine.from.assembly.id && line.from.assembly.id === assembly.id)
      })
      const fromAssembly = temLine.from.assembly
      if (alreadyHasLine) { return console.warn('此连线已经存在了') }
      if (fromAssembly.id === assembly.id) { return console.warn('回到起始点了') }
      const addedLine = lineAction.add(fromAssembly, assembly)
      assemblyAction.addFromLine(fromAssembly, addedLine)
      assemblyAction.addToLine(assembly, addedLine)
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
        assemblyAction.reLayoutPAssemblies(aTAssembly)
      }
    },
    enlargeAssembly: function() {
      const { choosenAssembly, assemblies } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        const aTAssembly = assemblies.find(element => choosenAssembly[element.id])
        if (!aTAssembly) return
        aTAssembly.size.width = aTAssembly.size.width * 1.1
        aTAssembly.size.height = aTAssembly.size.height * 1.1
        assemblyAction.reLayoutPAssemblies(aTAssembly)
      }
    },
    deleteAssembly: function() {
      const { choosenAssembly, assemblies } = oprateData
      this.deleteRightAssembly(assemblies.find(asm => choosenAssembly[asm.id]))
    },
    deleteRightAssembly: function(_assembly) {
      const { assemblies, parasiticAssemblies, lines, actionBtns } = oprateData
      if (_assembly && Object.keys(_assembly).length) {
        assemblies.forEach((element, index) => {
          if (_assembly.id === element.id) {
            oprateData.lines = lines.filter(line => {
              return !element.lines.from.some(fromLine => line.id === fromLine.id) && !element.lines.to.some(fromLine => line.id === fromLine.id)
            })
            oprateData.parasiticAssemblies = parasiticAssemblies.filter(parasiticAssembly => {
              return !element.belongs.some(belong => belong.id === parasiticAssembly.id)
            })
            if (element.wapper) {
              element.wapper.children.forEach((child, i) => {
                if (child.id === element.id) {
                  element.wapper.children.splice(i, 1)
                  wAssemblyAction.reLayout(element.wapper)
                }
              })
            }
            if (element.children && element.children.length) {
              element.children.forEach(child => {
                child.wapper = null
              })
            }
            if (element.highLevelAssembly) {
              element.highLevelAssembly.belowLevelAssembly.forEach((ba, _index) => {
                if (ba.id === element.id) {
                  element.highLevelAssembly.belowLevelAssembly.splice(_index, 1)
                }
              })
            }
            assemblies.splice(index, 1)
          }
        })
        actionBtns.enable = false
      }
    },
    deletePAssembly: function(pAssembly) {
      const { parasiticAssemblies } = oprateData
      parasiticAssemblies.forEach((pa, index) => {
        if (pa.id === pAssembly.id) {
          pAssembly.belongsTo.belongs.forEach((belong, _index) => {
            if (belong.id === pAssembly.id) {
              pAssembly.belongsTo.belongs.splice(_index, 1)
            }
          })
          parasiticAssemblies.splice(index, 1)
        }
      })
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
        if (assembly.highLevelAssembly) {
          assembly.draw = material.parasiticAssemblies[assembly.assemblyName].draw ? material.parasiticAssemblies[assembly.assemblyName].draw() : function(ctx, position, size, image) {
            drawAImage(ctx, image, position, size)
          }
        } else {
          assembly.draw = material.assemblies[assembly.assemblyName].draw ? material.assemblies[assembly.assemblyName].draw() : function(ctx, position, size, image) {
            drawAImage(ctx, image, position, size)
          }
        }
        assembly.image = util.getImage(assembly.imageUrl)
      })
      parasiticAssemblies.forEach(pAssembly => {
        pAssembly.draw = material.parasiticAssemblies[pAssembly.assemblyName].draw ? material.parasiticAssemblies[pAssembly.assemblyName].draw() : null
        pAssembly.image = util.getImage(pAssembly.imageUrl)
      })
      lines.forEach(line => {
        line.draw = material.lines[line.type].draw()
      })
      return {
        assemblies,
        lines,
        parasiticAssemblies
      }
    },
    takeAction: function(position) {
      const { actionBtns, choosenAssembly } = oprateData
      let btn = actionBtns.btns.find(btn => checkIsBelongPosition(position, {
        x: btn.position.x,
        endX: btn.position.x + btn.size.width,
        y: btn.position.y,
        endY: btn.position.y + btn.size.height,
      }))
      if (btn) {
        if (btn.type === 'deleteBtn') { this.deleteAssembly() }
        if (btn.type === 'cancelChooseBtn') { util.clearObj(choosenAssembly); actionBtns.enable = false }
        return true
      }
      return false
    }
  }
}
