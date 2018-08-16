import UUID from 'uuid'
import util from './util'
import { drawAImage } from './draw/drawUtil'

function checkIsBelongPosition (point, belongPoints) {
  return point.x > belongPoints.x && point.x < belongPoints.endX && point.y > belongPoints.y && point.y < belongPoints.endY
}
function checkIsBelongLine (point, from, to) {
  const width = 30
  return
}

export default function(oprateData) {
  return {
    transPixelToPos: function(pixel) {
      const { dom } = oprateData
      return {
        x: (pixel.x - dom.content.offsetLeft - dom.canvas.offsetLeft) / dom.canvas.width * 1000,
        y: (pixel.y - dom.content.offsetTop - dom.canvas.offsetTop) / dom.canvas.width * 1000
      }
    },
    addAssmbly: function(assembly, position) {
      const { assemblies, material } = oprateData
      assemblies.push({
        id: UUID(),
        assemblyName: assembly,
        imageUrl: material.assemblies[assembly].imageUrl,
        position: {
          x: position.x - ((material.assemblies[assembly].size && material.assemblies[assembly].size.width) || 100) / 2,
          y: position.y - ((material.assemblies[assembly].size && material.assemblies[assembly].size.height) || 100) / 2,
        },
        size: {
          width: (material.assemblies[assembly].size && material.assemblies[assembly].size.width) || 100,
          height: (material.assemblies[assembly].size && material.assemblies[assembly].size.height) || 100
        },
        lines: {
          from: [],
          to: []
        },
        draw: material.assemblies[assembly].draw ? material.assemblies[assembly].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        },
        acturalData: {}
      })
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
    updateAssemblyPosition: function(position) {
      const { assemblies, ableMoveAssembly } = oprateData
      assemblies.forEach(element => {
        if (ableMoveAssembly[element.id]) {
          element.position = {
            x: position.x - element.size.width / 2,
            y: position.y - element.size.height / 2
          }
          element.lines.from.forEach(line => {
            line.line.from.position.x = position.x
            line.line.from.position.y = position.y
          })
          element.lines.to.forEach(line => {
            line.line.to.position.x = position.x
            line.line.to.position.y = position.y
          })
        }
      })
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
        temLine.draw = material.lines[Object.keys(activeLine)[0]].draw()
      }
    },
    addLine: function(assembly) {
      const { temLine, lines } = oprateData
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
        assemblies.forEach(element => {
          if (choosenAssembly[element.id]) {
            element.size.width = element.size.width / 1.1
            element.size.height = element.size.height / 1.1
          }
        })
      }
    },
    enlargeAssembly: function() {
      const { choosenAssembly, assemblies } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        assemblies.forEach(element => {
          if (choosenAssembly[element.id]) {
            element.size.width = element.size.width * 1.1
            element.size.height = element.size.height * 1.1
          }
        })
      }
    },
    deleteAssembly: function() {
      const { choosenAssembly, assemblies, lines } = oprateData
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        assemblies.forEach((element, index) => {
          if (choosenAssembly[element.id]) {
            oprateData.lines = lines.filter(line => {
              return !element.lines.from.some(fromLine => line.id === fromLine.id) && !element.lines.to.some(fromLine => line.id === fromLine.id)
            })
            assemblies.splice(index, 1)
          }
        })
      }
    }
  }
}
