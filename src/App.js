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
let flag = false // 是否在选择的过程中
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
        y: (ev.clientY - chartsInfo.offsetTop) / chartsInfo.height * 1000 - ((formatItems[data].size && formatItems[data].size.height) || 100) / 2,
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
    const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.height * 1000
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
    const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.height * 1000
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
    moveObj = {}
    const clickX = (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000
    const clickY = (ev.clientY - chartsInfo.offsetTop) / chartsInfo.height * 1000
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
        moveObj[element.hash] = true
      }
    })
    Object.keys(moveObj).forEach((element, index) => {
      if (index !== Object.keys(moveObj).length - 1) {
        moveObj[element] = false
      }
    })
  }
  loseMouse = () => {
    flag = false
    moveObj = {}
  }
  onMouseMoveInCanvas = (ev) => {
    if (flag && Object.keys(moveObj).length > 0) {
      chartConfig.forEach(element => {
        if (moveObj[element.hash]) {
          element.position = {
            x: (ev.clientX - chartsInfo.offsetLeft) / chartsInfo.width * 1000 - element.size.width / 2,
            y: (ev.clientY - chartsInfo.offsetTop) / chartsInfo.height * 1000 - element.size.height / 2,
          }
        }
      })
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
                    <img key={index} src={element.imgSrc} id={element.key} ref={'line' + index} />
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
            onMouseUp={this.loseMouse}
            onMouseOut={this.loseMouse}
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
    chartsInfo.offsetTop = c.offsetTop
    chartsInfo.offsetLeft = c.offsetLeft
    chartsInfo.width = c.offsetWidth
    chartsInfo.height = c.offsetHeight
    let cxt = c.getContext('2d')
    function mainLoop() {
      cxt.clearRect(0, 0, c.width, c.height)
      draw(cxt, chartConfig, lineConfig, formatItems, choosenObj, hoverObj)
      requestAnimationFrame(mainLoop)
    }
    mainLoop()
  }
}
export default Chart
