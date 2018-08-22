import React, { Component } from 'react'
import styles from './index.less'
import draw from './draw/draw'
import util from './util'
import actionMethod from './actionMehod'

const mode = util.keysSwith({ 'assembly': true, 'line': false, 'inLineChoosen': false })
const oprateData = {
  mode, // 用来判断当前处于哪个操作模式中（组件还是连线或者其它）
  ctx: null,
  dom: { canvas: {}},
  assemblies: [],
  choosenAssembly: {},
  ableMoveAssembly: {},
  lines: [],
  choosenLine: {},
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
  chooseAssembly (ev, callBack) {
    const { mode, choosenLine, choosenAssembly } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (!mode.is('line')) {
      mode.setTo('assembly')
      util.clearObj(choosenLine)
      util.clearObj(choosenAssembly)
      const line = actionMehodWapper.chooseLine(position)
      if (line) {
        mode.setTo('inLineChoosen')
        return
      }
      const assembly = actionMehodWapper.chooseAssmbly(position)
      if (callBack && assembly) {
        callBack(Object.assign({}, assembly), function(acturalData) {
          actionMehodWapper.updateChoosenAssemblyActuralData(acturalData)
        })
      }
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
    console.log('evevev', ev)
    console.log(ev.clientX, ev.clientY)
    console.log(ev.pageX, ev.pageY)
    console.log(ev.screenX, ev.screenY)
    console.log(document.body.scrollHeight - document.body.clientHeight)
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
  narrowAssembly () {
    mode.is('assembly') && actionMehodWapper.narrowAssembly()
  }
  enlargeAssembly () {
    mode.is('assembly') && actionMehodWapper.enlargeAssembly()
  }
  deleteAssemblyOrLine () {
    console.log(mode.getCurrentMode())
    mode.is('assembly') && actionMehodWapper.deleteAssembly()
    mode.is('inLineChoosen') && actionMehodWapper.deleteLine()
  }
  render() {
    const { typeSummary, assemblies, lines } = this.state
    return (
      <div className={styles['flow-content']} ref='flow_content'>
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
                          assemblies[assembly].typeBelong === type ? <div key={i}>
                            <img
                              alt={assemblies[assembly].assemblyName}
                              className={styles['assembly-img']}
                              src={assemblies[assembly].imageUrl}
                              id={assembly}
                              draggable={true}
                              onDragStart={(ev) => this.dragAssembly(ev)}
                              onMouseEnter={() => { assemblies[assembly].showTip = true; this.setState({ assemblies }) }}
                              onMouseLeave={() => { assemblies[assembly].showTip = false; this.setState({ assemblies }) }}
                            />
                            <div className={assemblies[assembly].showTip ? styles.show : styles.hide}>
                              <p>{assemblies[assembly].assemblyName}</p>
                              <img src={assemblies[assembly].imageUrl} />
                            </div>
                          </div> : ''
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
          <div>
            <p>线条（点击选中进行连线）</p>
            <div>
              {
                Object.keys(lines).map((line, i) => {
                  return (
                    <div key={i}>
                      <img
                        className={!lines[line].isActive ? styles['line-img'] : styles['line-img-active']}
                        src={lines[line].imgSrc}
                        id={line} draggable={false}
                        onClick={(ev) => this.setActiveLine(ev, line, lines)}
                        onMouseEnter={() => { lines[line].showTip = true; this.setState({ lines }) }}
                        onMouseLeave={() => { lines[line].showTip = false; this.setState({ lines }) }}
                      />
                      <div className={lines[line].showTip ? styles.show : styles.hide}>
                        <p>{lines[line].lineName}</p>
                        <img src={lines[line].imgSrc} />
                      </div>
                    </div>
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
            onClick={(ev) => this.chooseAssembly(ev, this.props.chooseAssembly)}
            onMouseDown={(event) => this.moveStart(event)}
            onMouseUp={event => this.moveEnd(event)}
            onMouseOut={event => this.moveEnd(event)}
            onMouseMove={(event) => this.move(event)}
          />
        </div>
        <div className={styles['action-field']}>
          <button onClick={this.narrowAssembly}>Narrow</button>
          <button onClick={this.enlargeAssembly}>Enlarge</button>
          <button onClick={this.deleteAssemblyOrLine}>Delete</button>
        </div>
      </div>
    )
  }
  componentDidMount() {
    oprateData.dom.content = this.refs['flow_content']
    oprateData.dom.canvas = this.refs['flow_canvas']
    drawWapper.init()
  }
}
export default Chart
