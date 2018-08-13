import React, { Component } from 'react'
import styles from './index.less'
import draw from './draw/draw'
import util from './util'
import actionMehod from './actionMehod'

const mode = util.keysSwith({ 'assembly': true, 'line': false })
const oprateData = {
  mode, // 用来判断当前处于哪个操作模式中（组件还是连线或者其它）
  ctx: null,
  dom: { canvas: {}},
  assemblies: [],
  choosenAssembly: {},
  ableMoveAssembly: {},
  lines: [],
  material: {
    assemblies: {},
    lines: {}
  }
}

const drawWapper = draw(oprateData)
const actionMehodWapper = actionMehod(oprateData)

class Chart extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
    oprateData.material.assemblies = props.assemblies
    oprateData.material.lines = props.lines
  }
  dragAssembly (ev) {
    ev.dataTransfer.setData('assembly', ev.target.id)
  }
  materialDrop (ev) {
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    actionMehodWapper.addAssmbly(ev.dataTransfer.getData('assembly'), position)
  }
  chooseAssembly (ev) {
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    actionMehodWapper.chooseAssmbly(position)
  }
  moveStart (ev) {
    const { mode } = oprateData
    if (mode.is('assembly')) {
      const position = actionMehodWapper.transPixelToPos({
        x: ev.clientX,
        y: ev.clientY
      })
      actionMehodWapper.addAbleMoveAssembly(position)
    }
  }
  moveEnd (ev) {
    const { mode } = oprateData
    if (mode.is('assembly')) {
      oprateData.ableMoveAssembly = {}
    }
  }
  move (ev) {
    const { mode, ableMoveAssembly } = oprateData
    if (mode.is('assembly') && Object.keys(ableMoveAssembly).length) {
      const position = actionMehodWapper.transPixelToPos({
        x: ev.clientX,
        y: ev.clientY
      })
      actionMehodWapper.updateAssemblyPosition(position)
    }
  }
  render() {
    const { typeSummary, assemblies } = this.state
    return (
      <div className={styles['flow-content']}>
        <div className={styles['left_side']}>
          {
            Object.keys(typeSummary).map(type => {
              return (
                <div key = {type}>
                  <p>{typeSummary[type]}</p>
                  <div>
                    {
                      Object.keys(assemblies).map((assembly, i) => {
                        return (
                          (assemblies[assembly].typeBelong === type) &&
                          <img key={i} src={assemblies[assembly].imageUrl} id={assembly} draggable={true} onDragStart={(ev) => this.dragAssembly(ev)} />
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
            <div />
          </div>
        </div>
        <div
          className={styles['content']}
          onDrop={(event) => this.materialDrop(event)}
          onDragOver={(ev) => ev.preventDefault()}
        >
          <canvas
            ref='flow_canvas'
            onClick={this.chooseAssembly}
            onMouseDown={(event) => this.moveStart(event)}
            onMouseUp={event => this.moveEnd(event)}
            onMouseOut={event => this.moveEnd(event)}
            onMouseMove={(event) => this.move(event)}
          />
        </div>
      </div>
    )
  }
  componentDidMount() {
    oprateData.dom.canvas = this.refs['flow_canvas']
    drawWapper.init()
  }
}
export default Chart
