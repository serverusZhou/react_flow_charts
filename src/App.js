import React, { Component } from 'react'
import styles from './index.less'
import items from './items'
import draw from './draw'
import utils from './utils'
import UUID from 'uuid'

const icons = items.icons
const lines = items.lines
const formatItems = utils.getAllItems(icons)
const chartConfig = [] // 记录图表中加入的图标
const lineConfig = [] // 记录图标中加入的线
const chartsInfo = {} // 记录canvas的位置信息
let choosenObj = {} // 被点击选择的
let hoverObj = {} // 被hover的
let moveObj = {} // 需要被移动的
let lineObj = [] // 选中的线条
let flag = false // 是否在选择的过程中
let relativeLines = [] // 操作受关联的线
let mode = {
  default: true,
  lineMode: false
}
class Chart extends Component {
  onDragstartFunc = (ev) => {
    ev.dataTransfer.setData('key', ev.target.id)
  }
  onDropFunc = (ev) => {
    const data = ev.dataTransfer.getData('key')
    chartConfig.push({
      hash: UUID(),
      type: data,
      position: {
        x: (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000 - ((formatItems[data].size && formatItems[data].size.width) || 100) / 2,
        y: (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000 - ((formatItems[data].size && formatItems[data].size.height) || 100) / 2,
      },
      size: {
        width: (formatItems[data].size && formatItems[data].size.width) || 100,
        height: (formatItems[data].size && formatItems[data].size.height) || 100
      }
    })
  }
  allowDrop = (ev) => {
    ev.preventDefault()
  }
  onMouseMove = (ev) => {
    hoverObj = {}
    const clickX = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
    const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000
    chartConfig.forEach(element => {
      if (utils.checkIsBelongPosition({
        x: clickX,
        y: clickY
      }, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      })) {
        hoverObj[element.hash] = true
      }
    })
  }
  onClick = (ev) => {
    choosenObj = {}
    const clickX = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
    const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000
    chartConfig.forEach(element => {
      if (utils.checkIsBelongPosition({
        x: clickX,
        y: clickY
      }, {
        x: element.position.x,
        endX: element.position.x + element.size.width,
        y: element.position.y,
        endY: element.position.y + element.size.height,
      })) {
        choosenObj[element.hash] = true
      }
    })
    Object.keys(choosenObj).forEach((element, index) => {
      if (index !== Object.keys(choosenObj).length - 1) {
        choosenObj[element] = false
      }
    })
  }
  onMouseDownInCanvas = (ev) => {
    flag = true
    relativeLines = []
    if (mode.default) {
      moveObj = {}
      const clickX = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
      const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000
      chartConfig.forEach((element, index) => {
        if (utils.checkIsBelongPosition({
          x: clickX,
          y: clickY
        }, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          moveObj[element.hash] = {
            isEffect: true,
            index
          }
        }
      })
      Object.keys(moveObj).forEach((element, index) => {
        if (index !== Object.keys(moveObj).length - 1) {
          moveObj[element].isEffect = false
        } else if (index === Object.keys(moveObj).length - 1) {
          lineConfig.forEach((line, lIndex) => {
            if (line.from.element.hash === element || line.to.element.hash === element) {
              relativeLines.push({
                hash: line.hash,
                index: lIndex,
                objIndex: moveObj[element].index,
                fromOrTo: line.from.element.hash === element ? 'from' : 'to'
              })
            }
          })
        }
      })
    }
    if (mode.lineMode) {
      const clickX = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
      const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000
      chartConfig.forEach(element => {
        if (utils.checkIsBelongPosition({
          x: clickX,
          y: clickY
        }, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          lineConfig.push({
            hash: UUID(),
            isTemporarily: true,
            from: {
              hash: element.hash,
              element: element,
              position: {
                x: element.position.x + element.size.width / 2,
                y: element.position.y + element.size.height / 2,
              }
            },
            to: {
              hash: null,
              position: {
                x: element.position.x,
                y: element.position.y,
              }
            }
          })
        }
      })
    }
  }
  loseMouse = (ev) => {
    flag = false
    moveObj = {}
    if (mode.lineMode) {
      const clickX = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
      const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000
      const exitLine = {}
      chartConfig.forEach(element => {
        if (utils.checkIsBelongPosition({
          x: clickX,
          y: clickY
        }, {
          x: element.position.x,
          endX: element.position.x + element.size.width,
          y: element.position.y,
          endY: element.position.y + element.size.height,
        })) {
          exitLine.element = element
          exitLine.positionX = element.position.x + element.size.width / 2
          exitLine.positionY = element.position.y + element.size.height / 2
        }
      })
      if (Object.keys(exitLine).length) {
        const temLine = lineConfig.find(element => element.isTemporarily)
        if (temLine) {
          const finalPosition = utils.getLinePosition({
            x: temLine.from.position.x,
            y: temLine.from.position.y
          }, {
            x: exitLine.positionX,
            y: exitLine.positionY
          }, {
            width: temLine.from.element.size.width,
            height: temLine.from.element.size.height,
          }, {
            width: exitLine.element.size.width,
            height: exitLine.element.size.height,
          })
          temLine.isTemporarily = false
          temLine.from.position.x = finalPosition.from.x
          temLine.from.position.y = finalPosition.from.y
          temLine.to.position.x = finalPosition.to.x
          temLine.to.position.y = finalPosition.to.y
          temLine.to.element = exitLine.element
        }
      } else {
        lineConfig.forEach((element, index) => {
          if (element.isTemporarily) {
            lineConfig.splice(index, 1)
          }
        })
      }
    }
  }
  onMouseMoveInCanvas = (ev) => {
    if (mode.default) {
      if (flag && Object.keys(moveObj).length > 0) {
        chartConfig.forEach(element => {
          if (moveObj[element.hash] && moveObj[element.hash].isEffect) {
            element.position = {
              x: (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000 - element.size.width / 2,
              y: (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000 - element.size.height / 2,
            }
          }
        })
        relativeLines.forEach((relativeLine, lIndex) => {
          console.log('relativeLine.objIndexrelativeLine.objIndex', relativeLine.objIndex)
          const connectLine = lineConfig[relativeLine.index]
          const item = chartConfig[relativeLine.objIndex]
          const fromOrTo = relativeLine.fromOrTo
          console.log('relativeLine.fromOrTo', relativeLine.fromOrTo)
          console.log('connectLineconnectLine', connectLine)
          console.log('item.positionitem.position', item)
          console.log('fromOrTo === to', fromOrTo === 'to')
          console.log('fromOrTo === from', fromOrTo === 'from')
          const finalPosition = utils.getLinePosition({
            x: fromOrTo === 'to' ? (connectLine.from.element.position.x + connectLine.from.element.size.width / 2) : (item.position.x + item.size.width / 2),
            y: fromOrTo === 'to' ? (connectLine.from.element.position.x + connectLine.from.element.size.width / 2) : (item.position.y + item.size.height / 2),
          }, {
            x: fromOrTo === 'from' ? (connectLine.to.element.position.x + connectLine.to.element.size.width / 2) : (item.position.x + item.size.width / 2),
            y: fromOrTo === 'from' ? (connectLine.to.element.position.y + connectLine.to.element.size.height / 2) : (item.position.y + item.size.height / 2),
          }, {
            width: connectLine.from.element.size.width,
            height: connectLine.from.element.size.height,
          }, {
            width: connectLine.to.element.size.width,
            height: connectLine.to.element.size.height,
          })
          connectLine.from.position.x = finalPosition.from.x
          connectLine.from.position.y = finalPosition.from.y
          connectLine.to.position.x = finalPosition.to.x
          connectLine.to.position.y = finalPosition.to.y
        })
      }
    }
    if (flag && mode.lineMode) {
      const temLine = lineConfig.find(element => element.isTemporarily)
      if (temLine) {
        temLine.to.position.x = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
        temLine.to.position.y = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.width * 1000
      }
    }
  }
  remove = () => {
    chartConfig.forEach((element, index) => {
      if (choosenObj[element.hash]) {
        chartConfig.splice(index, 1)
      }
    })
  }
  enlarge = () => {
    chartConfig.forEach((element, index) => {
      if (choosenObj[element.hash]) {
        element.size.width = element.size.width * 1.1
        element.size.height = element.size.height * 1.1
      }
    })
  }
  narrow = () => {
    chartConfig.forEach((element, index) => {
      if (choosenObj[element.hash]) {
        element.size.width = element.size.width / 1.1
        element.size.height = element.size.height / 1.1
      }
    })
  }
  chooseLine = (element) => {
    const isAlreadyChoosen = lineObj.some(item => {
      return element.type === item.type
    })
    if (!isAlreadyChoosen) {
      lineObj.push(element)
    } else {
      lineObj = []
    }
    if (lineObj.length) {
      mode = {
        default: false,
        lineMode: true
      }
    } else {
      mode = {
        default: true,
        lineMode: false
      }
    }
    console.log('modemode', mode)
  }
  render() {
    return (
      <div className={styles['flow-content']}>
        <div className={styles['left_side']}>
          {
            icons.map((obj, index) => {
              return (
                <div key = {index}>
                  <p>{obj.type}</p>
                  <div>
                    {
                      obj.icon.map((icon, i) => {
                        return (
                          <img key={i} src={icon.imgSrc} id={icon.key} draggable={true} ref={'key' + i} onDragStart={(event) => this.onDragstartFunc(event)} />
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
          <div>
            <p>线条</p>
            <div>
              {
                lines.map((element, index) => {
                  return (
                    <img key={index} src={element.imgSrc} draggable={false} id={element.key} ref={'line' + index} onClick = {() => this.chooseLine(element)} />
                  )
                })
              }
            </div>
          </div>
        </div>
        <div
          className={styles['content']}
          onDrop={(event) => this.onDropFunc(event)}
          onDragOver={(event) => this.allowDrop(event)}
          onMouseMove={(event) => this.onMouseMove(event)}
          onClick = {(event) => this.onClick(event)}
        >
          <canvas
            ref='flow_canvas'
            width='1000'
            height='1000'
            onMouseDown={(event) => this.onMouseDownInCanvas(event)}
            onMouseUp={event => this.loseMouse(event)}
            onMouseOut={event => this.loseMouse(event)}
            onMouseMove={(event) => this.onMouseMoveInCanvas(event)}
            onKeyPress={(event => this.onKeyDown(event))}
          />
        </div>
        <div>
          <button onClick={this.remove}>delete</button>
          <br />
          <button onClick={this.enlarge}>enlarge</button>
          <br />
          <button onClick={this.narrow}>narrow</button>
          <br />
          <button onClick={this.save}>save</button>
        </div>
      </div>
    )
  }
  componentDidMount() {
    const that = this
    const c = that.refs['flow_canvas']
    c.width = 1000
    c.height = 1000 * c.offsetHeight / c.offsetWidth
    chartsInfo.offsetTop = c.offsetTop
    chartsInfo.offsetLeft = c.offsetLeft
    chartsInfo.width = c.offsetWidth
    chartsInfo.height = c.offsetHeight
    let cxt = c.getContext('2d')
    function mainLoop() {
      cxt.clearRect(0, 0, c.width, c.height)
      draw(chartsInfo, cxt, chartConfig, lineConfig, formatItems, choosenObj, hoverObj)
      requestAnimationFrame(mainLoop)
    }
    mainLoop()
  }
}
export default Chart
