import React, { Component } from 'react'
import styles from './index.less'
import draw from './draw/draw'
import util from './util'
import actionMethod from './actionMehod'

const mode = util.keysSwith({ 'assembly': true, 'line': false })
const oprateData = {
  mode, // 用来判断当前处于哪个操作模式中（组件还是连线或者其它）
  ctx: null,
  dom: { canvas: {}},
  assemblies: [],
  choosenAssembly: {},
  ableMoveAssembly: {},
  lines: [],
  activeLine: {},
  temLine: {},
  material: {
    assemblies: {},
    lines: {}
  }
}

const drawWapper = draw(oprateData)
const actionMehodWapper = actionMethod(oprateData)

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
    if (mode.is('assembly')) {
      actionMehodWapper.chooseAssmbly(position)
    }
  }
  moveStart (ev) {
    const { mode } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    mode.is('assembly') && actionMehodWapper.addAbleMoveAssembly(position)
    mode.is('line') && actionMehodWapper.addTemLine(position)
  }
  moveEnd (ev) {
    const { mode, ableMoveAssembly, temLine } = oprateData
    mode.is('assembly') && util.clearObj(ableMoveAssembly)
    if (mode.is('line')) {
      const position = actionMehodWapper.transPixelToPos({
        x: ev.clientX,
        y: ev.clientY
      })
      const assemblyAtPosition = actionMehodWapper.findAssmblyByPosition(position)
      if (assemblyAtPosition && Object.keys(assemblyAtPosition).length) {
        actionMehodWapper.addLine(assemblyAtPosition)
      }
      util.clearObj(temLine)
    }
  }
  move (ev) {
    const { mode, ableMoveAssembly, temLine } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (mode.is('assembly') && Object.keys(ableMoveAssembly).length) {
      actionMehodWapper.updateAssemblyPosition(position)
    }
    if (mode.is('line') && Object.keys(temLine).length) {
      actionMehodWapper.moveTemLine(position)
    }
  }
  setActiveLine (ev, lineKey, lines) {
    if (!lines[lineKey].isActive) {
      Object.keys(lines).forEach(key => {
        lines[key].isActive = false
      })
    }
    lines[lineKey].isActive = !lines[lineKey].isActive
    this.setState({ lines })
    actionMehodWapper.setActiveLine(ev.target.id)
  }
  render() {
    const { typeSummary, assemblies, lines } = this.state
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
                          assemblies[assembly].typeBelong === type
                            ? <img className={styles['assembly-img']} key={i} src={assemblies[assembly].imageUrl} id={assembly} draggable={true} onDragStart={(ev) => this.dragAssembly(ev)} /> : ''
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
                Object.keys(lines).map((line, i) => {
                  return (
                    <img
                      className={!lines[line].isActive ? styles['line-img'] : styles['line-img-active']}
                      key={i} src={lines[line].imgSrc}
                      id={line} draggable={false} onClick={(ev) => this.setActiveLine(ev, line, lines)}
                    />
                  )
                })
              }
            </div>
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