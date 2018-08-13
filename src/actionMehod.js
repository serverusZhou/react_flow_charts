import UUID from 'uuid'
import { drawAImage } from './draw/drawUtil'

function checkIsBelongPosition (point, belongPoints) {
  if (point.x > belongPoints.x && point.x < belongPoints.endX && point.y > belongPoints.y && point.y < belongPoints.endY) {
    return true
  } else {
    return false
  }
}

export default function(oprateData) {
  return {
    transPixelToPos: function(pixel) {
      const { dom } = oprateData
      return {
        x: (pixel.x - dom.canvas.offsetLeft) / dom.canvas.width * 1000,
        y: (pixel.y - dom.canvas.offsetTop) / dom.canvas.width * 1000
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
        draw: material.assemblies[assembly].draw ? material.assemblies[assembly].draw() : function(ctx, position, size, imgUrl) {
          drawAImage(ctx, imgUrl, position, size)
        }
      })
    },
    chooseAssmbly: function(position) {
      const { assemblies } = oprateData
      oprateData.choosenAssembly = {}
      assemblies.forEach(element => {
        if (checkIsBelongPosition(position, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          oprateData.choosenAssembly = {
            [element.id]: true
          }
        }
      })
    },
    addAbleMoveAssembly: function(position) {
      const { assemblies } = oprateData
      oprateData.ableMoveAssembly = {}
      assemblies.forEach(element => {
        if (checkIsBelongPosition(position, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          oprateData.ableMoveAssembly = {
            [element.id]: true
          }
        }
      })
    },
    updateAssemblyPosition: function(position) {
      const { assemblies, ableMoveAssembly } = oprateData
      assemblies.forEach(element => {
        if (ableMoveAssembly[element.id]) {
          console.log(position)
          element.position = position
        }
      })
    }
  }
}
