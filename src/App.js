import React, { Component } from 'react'
import styles from './index.less'
import items from './items'
import draw from './draw'
import utils from './utils'

const icons = items.icons
const lines = items.lines
const formatItems = utils.getAllItems(icons)
const chartConfig = [
  {
    type: 'friend1',
    position: {
      x: 20,
      y: 20
    },
    size: {
      width: 40,
      height: 20
    }
  }
]
class Chart extends Component {
  onDragstartFunc = (ev) => {
    ev.dataTransfer.setData('key', ev.target.id)
  }
  onDropFunc = (ev) => {
    const data = ev.dataTransfer.getData('key')
    console.log(ev.clientX)
    console.log(data)
  }
  allowDrop = (ev) => {
    ev.preventDefault()
  }
  onMouseMove = (ev) => {
    // console.log('move e.clientX', ev.clientX)
    // console.log('move e.clientY', ev.clientY)
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
        >
          <canvas ref='flow_canvas' />
        </div>
      </div>
    )
  }
  componentDidMount() {
    const that = this
    const c = that.refs['flow_canvas']
    let cxt = c.getContext('2d')
    function mainLoop() {
      cxt.clearRect(0, 0, c.width, c.height)
      draw(cxt, chartConfig, formatItems)
      requestAnimationFrame(mainLoop)
    }
    mainLoop()
    setTimeout(() => {
      chartConfig[0].position.x = 50
    }, 3000)
  }
}
export default Chart
