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

function checkIsBelongBrokenLine (point, allPoints, fromSize, toSize, isNearDistence = 20) {
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

function checkIsNearAPosition (position, points, distence = 20) {
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

function checkoutIsOutBox(insideBox, outsideBox) {
  return insideBox[0].x > outsideBox[1].x || insideBox[1].x < outsideBox[0].x || insideBox[0].y > outsideBox[1].y || insideBox[1].y < outsideBox[0].y
}

function checkIsThreePointsLine(point1, point2, point3) {
  const angle1 = Math.atan((point2.y - point1.y) / (point2.x - point1.x))
  const angle2 = Math.atan((point3.y - point2.y) / (point3.x - point2.x))
  return Math.abs(angle2 - angle1) < 0.15
}

export default function(oprateData) {
  return {
    transPixelToPos: function(pixel) {
      const pixelMap = {
        'pc': {
          width: 2500,
          height: 2500
        },
        'mobile': {
          width: 1000,
          height: 1000
        }
      }
      const { dom, device } = oprateData
      const canvasPosition = getPosition(dom.canvas)
      const scrollTop = getScrollTop()
      return {
        x: (pixel.x - canvasPosition.left) / dom.canvas.offsetWidth * pixelMap[device].width,
        y: (pixel.y - canvasPosition.top + scrollTop) / dom.canvas.offsetWidth * pixelMap[device].height
      }
    },
    addAssmbly: function(assembly, position) {
      const { assemblies, material, device } = oprateData
      if (assembly === 'wapperAssembly') {
        this.addWAssembly(assembly, position)
        return
      }
      const size = (function() {
        let width = (material.assemblies[assembly].size && material.assemblies[assembly].size.width) || 100
        let height = (material.assemblies[assembly].size && material.assemblies[assembly].size.height) || 100
        return {
          width: (device === 'mobile') ? width * 2 : width,
          height: (device === 'mobile') ? height * 2 : height
        }
      })()
      const image = new Image()
      image.src = material.assemblies[assembly].imageUrl
      const addAssembly = {
        id: UUID(),
        name: material.assemblies[assembly].assemblyName,
        assemblyName: assembly,
        imageUrl: material.assemblies[assembly].imageUrl,
        image,
        position: {
          x: position.x - size.width / 2,
          y: position.y - size.height / 2,
        },
        size: {
          width: size.width,
          height: size.height
        },
        positionPc: {
          x: position.x - size.width / 2,
          y: position.y - size.height / 2,
        },
        sizePc: {
          width: size.width,
          height: size.height
        },
        insizeSpacePercent: material.assemblies[assembly].insizeSpacePercent,
        lines: {
          from: [],
          to: []
        },
        belongs: [],
        wapper: null,
        children: [],
        belowLevelAssembly: [],
        draw: material.assemblies[assembly].draw ? material.assemblies[assembly].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        },
        acturalData: {}
      }
      assemblies.push(addAssembly)
      const wapperAssembly = assemblies.find(element => checkIsBelongPosition(position, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      }) && element.assemblyName === 'wapperAssembly')
      if (wapperAssembly && Object.keys(wapperAssembly) && wapperAssembly.assemblyName === 'wapperAssembly') {
        addAssembly.wapper = wapperAssembly
        wapperAssembly.children.push(addAssembly)
        this.resetWAssemblyLayout(wapperAssembly)
      }
    },
    resetWAssemblyLayout: function(wapperAssembly) {
      const childNum = wapperAssembly.children.length
      const { position, size } = wapperAssembly
      wapperAssembly.children.forEach((child, i) => {
        child.size.height = size.height - 50
        child.size.width = (size.width - 10 - childNum * 4) / childNum
        child.position.x = position.x + 5 + i * child.size.width + childNum * 2 * (i + 1)
        child.position.y = position.y + 5
      })
    },
    addWAssembly: function(assembly, position) {
      const { assemblies, material, device } = oprateData
      const size = (function() {
        let width = (material.others[assembly].size && material.others[assembly].size.width) || 300
        let height = (material.others[assembly].size && material.others[assembly].size.height) || 300
        return {
          width: (device === 'mobile') ? width * 2 : width,
          height: (device === 'mobile') ? height * 2 : height
        }
      })()
      const addAssembly = {
        id: UUID(),
        name: material.others[assembly].assemblyName,
        assemblyName: assembly,
        imageUrl: material.others[assembly].imgSrc,
        position: {
          x: position.x - size.width / 2,
          y: position.y - size.height / 2,
        },
        size: {
          width: size.width,
          height: size.height
        },
        insizeSpacePercent: material.others[assembly].insizeSpacePercent,
        lines: {
          from: [],
          to: []
        },
        belongs: [],
        wapper: null,
        children: [],
        belowLevelAssembly: [],
        draw: material.others[assembly].draw ? material.others[assembly].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        },
        acturalData: {}
      }
      assemblies.push(addAssembly)
    },
    addPAssmbly: function(parasiticAssembly, position, displayName, acturalData) {
      const { assemblies, material, parasiticAssemblies } = oprateData
      const belongToAssembly = assemblies.find(element => checkIsBelongPosition(position, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      }) && element.assemblyName !== 'wapperAssembly')
      if (belongToAssembly && Object.keys(belongToAssembly)) {
        if (material.parasiticAssemblies[parasiticAssembly].isPAndA) {
          this.toTurnAddPassmbly(belongToAssembly, material.parasiticAssemblies[parasiticAssembly], parasiticAssembly, displayName, acturalData)
          return
        }
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
        }, positionPc: {
          x: belongToAssembly.positionPc.x + belongToAssembly.insizeSpacePercent[3] * belongToAssembly.sizePc.width,
          y: belongToAssembly.positionPc.y + belongToAssembly.sizePc.height - belongToAssembly.insizeSpacePercent[2] * belongToAssembly.sizePc.height - belongToAssembly.sizePc.width * (1 - belongToAssembly.insizeSpacePercent[1] - belongToAssembly.insizeSpacePercent[3]) * ratio,
        }, sizePc: {
          width: belongToAssembly.sizePc.width * (1 - belongToAssembly.insizeSpacePercent[1] - belongToAssembly.insizeSpacePercent[3]),
          height: belongToAssembly.sizePc.width * (1 - belongToAssembly.insizeSpacePercent[1] - belongToAssembly.insizeSpacePercent[3]) * ratio
        }})
        const image = new Image()
        image.src = material.parasiticAssemblies[parasiticAssembly].imageUrl
        const addParasiticAssembly = {
          id: UUID(),
          name: material.parasiticAssemblies[parasiticAssembly].assemblyName,
          assemblyName: parasiticAssembly,
          imageUrl: material.parasiticAssemblies[parasiticAssembly].imageUrl,
          image,
          belongsTo: belongToAssembly,
          ratio: imageRatio(material.parasiticAssemblies[parasiticAssembly].imageUrl),
          isOccupyInternalSpace: material.parasiticAssemblies[parasiticAssembly].isOccupyInternalSpace,
          acturalData: {},
          ...remainPosition,
          draw: material.parasiticAssemblies[parasiticAssembly].draw ? material.parasiticAssemblies[parasiticAssembly].draw() : null
        }
        parasiticAssemblies.push(addParasiticAssembly)
        belongToAssembly.belongs.push(addParasiticAssembly)
      }
    },
    toTurnAddPassmbly: function(belongToAssembly, belong, belongName, displayName, acturalData) {
      const { assemblies, lines, material } = oprateData
      const turnedAssembly = {
        id: UUID(),
        name: belong.assemblyName,
        assemblyName: belongName,
        imageUrl: belong.imageUrl,
        position: {
          x: belong.offsetPosition.x > 0
            ? (belongToAssembly.position.x - belong.offsetPosition.x - Math.floor(Math.random() * 60))
            : belongToAssembly.position.x + belongToAssembly.size.width - belong.offsetPosition.x - Math.floor(Math.random() * 60),
          y: belong.offsetPosition.x > 0
            ? belongToAssembly.position.y - belong.offsetPosition.y - Math.floor(Math.random() * 60)
            : belongToAssembly.position.y + belongToAssembly.size.height - belong.offsetPosition.y - Math.floor(Math.random() * 60),
        },
        size: {
          width: belong.size.width,
          height: belong.size.height
        },
        positionPc: {
          x: belong.offsetPosition.x > 0
            ? (belongToAssembly.positionPc.x - belong.offsetPosition.x - Math.floor(Math.random() * 60))
            : belongToAssembly.positionPc.x + belongToAssembly.sizePc.width - belong.offsetPosition.x - Math.floor(Math.random() * 60),
          y: belong.offsetPosition.x > 0
            ? belongToAssembly.positionPc.y - belong.offsetPosition.y - Math.floor(Math.random() * 60)
            : belongToAssembly.positionPc.y + belongToAssembly.sizePc.height - belong.offsetPosition.y - Math.floor(Math.random() * 60),
        },
        sizePc: {
          width: belong.sizePc.width,
          height: belong.sizePc.height
        },
        lines: {
          from: [],
          to: []
        },
        displayName,
        belongs: [],
        highLevelAssembly: belongToAssembly,
        draw: belong.draw(),
        acturalData: acturalData || {}
      }
      assemblies.push(turnedAssembly)
      belongToAssembly.belowLevelAssembly.push(turnedAssembly)
      const lineId = UUID()
      const _line = {
        id: lineId,
        type: Object.keys(material.lines)[0],
        from: {
          assembly: belong.isTo ? belongToAssembly : turnedAssembly,
          position: {
            x: belong.isTo ? (belongToAssembly.position.x + belongToAssembly.size.width / 2) : (turnedAssembly.position.x + turnedAssembly.size.width / 2),
            y: belong.isTo ? (belongToAssembly.position.y + belongToAssembly.size.height / 2) : (turnedAssembly.position.y + turnedAssembly.size.height / 2),
          },
          positionPc: {
            x: belong.isTo ? (belongToAssembly.positionPc.x + belongToAssembly.sizePc.width / 2) : (turnedAssembly.positionPc.x + turnedAssembly.sizePc.width / 2),
            y: belong.isTo ? (belongToAssembly.positionPc.y + belongToAssembly.sizePc.height / 2) : (turnedAssembly.positionPc.y + turnedAssembly.sizePc.height / 2),
          },
        },
        to: {
          assembly: belong.isTo ? turnedAssembly : belongToAssembly,
          position: {
            x: belong.isTo ? (turnedAssembly.position.x + turnedAssembly.size.width / 2) : (belongToAssembly.position.x + belongToAssembly.size.width / 2),
            y: belong.isTo ? (turnedAssembly.position.y + turnedAssembly.size.height / 2) : (belongToAssembly.position.y + belongToAssembly.size.height / 2),
          },
          positionPc: {
            x: belong.isTo ? (turnedAssembly.positionPc.x + turnedAssembly.sizePc.width / 2) : (belongToAssembly.positionPc.x + belongToAssembly.sizePc.width / 2),
            y: belong.isTo ? (turnedAssembly.positionPc.y + turnedAssembly.sizePc.height / 2) : (belongToAssembly.positionPc.y + belongToAssembly.sizePc.height / 2),
          },
        },
        middlePoints: [{
          x: belong.isTo
            ? (turnedAssembly.position.x + turnedAssembly.size.width / 2 - 2)
            : (belongToAssembly.position.x + belongToAssembly.size.width / 2 - 2),
          y: belong.isTo
            ? belongToAssembly.position.y + belongToAssembly.size.height / 2
            : turnedAssembly.position.y + turnedAssembly.size.height / 2,
        }],
        middlePointsPc: [{
          x: belong.isTo
            ? (turnedAssembly.positionPc.x + turnedAssembly.sizePc.width / 2 - 2)
            : (belongToAssembly.positionPc.x + belongToAssembly.sizePc.width / 2 - 2),
          y: belong.isTo
            ? belongToAssembly.positionPc.y + belongToAssembly.sizePc.height / 2
            : turnedAssembly.positionPc.y + turnedAssembly.sizePc.height / 2,
        }],
        draw: material.lines[Object.keys(material.lines)[0]].draw()
      }
      belong.isTo ? belongToAssembly.lines.from.push({
        id: _line.id,
        line: _line
      }) : turnedAssembly.lines.from.push({
        id: _line.id,
        line: _line
      })
      belong.isTo ? turnedAssembly.lines.to.push({
        id: _line.id,
        line: _line
      }) : belongToAssembly.lines.to.push({
        id: _line.id,
        line: _line
      })
      lines.push(_line)
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
          element.acturalData = acturalData
        }
      })
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
        this.updateAllPAssemblyPosition(choosenA)
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
      const { assemblies, ableMoveAssembly, device } = oprateData
      const moveAssembly = assemblies.find(element => ableMoveAssembly[element.id])
      if (!moveAssembly || moveAssembly.wapper) { return }
      if (device === 'mobile') {
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
      } else if (device === 'pc') {
        moveAssembly.positionPc = {
          x: position.x - moveAssembly.sizePc.width / 2,
          y: position.y - moveAssembly.sizePc.height / 2
        }
        moveAssembly.lines.from.forEach(line => {
          line.line.from.positionPc.x = position.x
          line.line.from.positionPc.y = position.y
        })
        moveAssembly.lines.to.forEach(line => {
          line.line.to.positionPc.x = position.x
          line.line.to.positionPc.y = position.y
        })
      }
      this.updateAllPAssemblyPosition(moveAssembly)

      const wAssembly = assemblies.find(element => (checkIsBelongPosition(position, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      }) && element.assemblyName === 'wapperAssembly'))
      if (wAssembly && Object.keys(wAssembly) && wAssembly.assemblyName === 'wapperAssembly' && moveAssembly.assemblyName !== 'wapperAssembly') {
        moveAssembly.wapper = wAssembly
        if (!wAssembly.children.find(child => child.id === moveAssembly.id)) {
          wAssembly.children.push(moveAssembly)
        }
        this.resetWAssemblyLayout(wAssembly)
      }
      if (moveAssembly.assemblyName === 'wapperAssembly') {
        this.resetWAssemblyLayout(moveAssembly)
      }
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
      this.updateAllPAssemblyPosition(aTAssembly)
      this.updateActionBtnPosition()
      if (aTAssembly.assemblyName === 'wapperAssembly') {
        this.resetWAssemblyLayout(aTAssembly)
      }
    },
    updateLinePositions: function(position) {
      const { lines, ableAddPointLine } = oprateData
      const line = lines.find(line => !!ableAddPointLine[line.id])
      if (line && Object.keys(line).length) {
        line.middlePoints[ableAddPointLine[line.id].belongIndex] = position
      }
    },
    setLinePositions: function(position) {
      const { lines, ableAddPointLine } = oprateData
      const line = lines.find(line => !!ableAddPointLine[line.id])
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
    },
    updateAllPAssemblyPosition: function(assembly) {
      const { device } = oprateData
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
          belong.positionPc = updateInfo.position
          belong.sizePc = updateInfo.size
        } else if (device === 'pc') {
          belong.position = updateInfo.position
          belong.size = updateInfo.size
        }
      })
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
        temLine.middlePoints = []
        temLine.middlePointsPc = []
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
      if (alreadyHasLine) {
        console.warn('此连线已经存在了')
        return
      }
      if (temLine.from.assembly.id === assembly.id) {
        console.warn('回到起始点了')
        return
      }
      temLine.to.position = {
        x: assembly.position.x + assembly.size.width / 2,
        y: assembly.position.y + assembly.size.height / 2,
      }
      temLine.to.positionPc = {
        x: assembly.positionPc.x + assembly.sizePc.width / 2,
        y: assembly.positionPc.y + assembly.sizePc.height / 2,
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
        this.updateAllPAssemblyPosition(aTAssembly)
      }
    },
    enlargeAssembly: function() {
      const { choosenAssembly, assemblies } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        const aTAssembly = assemblies.find(element => choosenAssembly[element.id])
        if (!aTAssembly) return
        aTAssembly.size.width = aTAssembly.size.width * 1.1
        aTAssembly.size.height = aTAssembly.size.height * 1.1
        this.updateAllPAssemblyPosition(aTAssembly)
      }
    },
    deleteAssembly: function() {
      const { choosenAssembly, assemblies, parasiticAssemblies, lines, actionBtns } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        assemblies.forEach((element, index) => {
          if (choosenAssembly[element.id]) {
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
                  this.resetWAssemblyLayout(element.wapper)
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
        assembly.draw = material.assemblies[assembly.assemblyName].draw ? material.assemblies[assembly.assemblyName].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        }
      })
      parasiticAssemblies.forEach(pAssembly => {
        pAssembly.draw = material.parasiticAssemblies[pAssembly.assemblyName].draw ? material.parasiticAssemblies[pAssembly.assemblyName].draw() : null
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
