import React, { Component } from 'react'
import styles from './index.less'
import draw from './draw/draw'
import util from './util'
import actionMethod from './actionMehod'

const mode = util.keysSwith({ 'assembly': true, 'line': false, 'inLineChoosen': false })
let flag = false
const oprateData = {
  mode, // 用来判断当前处于哪个操作模式中（组件还是连线或者其它）
  ctx: null,
  dom: { canvas: {}},
  assemblies: [],
  choosenAssembly: {},
  ableMoveAssembly: {},
  hoverAssembly: {},
  parasiticAssemblies: [],
  lines: [],
  choosenLine: {},
  activeLine: {},
  ableAddPointLine: {},
  temLine: {},
  material: {
    assemblies: {},
    parasiticAssemblies: {},
    lines: {},
  }
}

const drawWapper = draw(oprateData)
const actionMehodWapper = actionMethod(oprateData)

class Chart extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
    oprateData.material = props.material
    const resetMeterail = actionMehodWapper.resetAssembliesAndLines(props.assemblies, props.lines, props.parasiticAssemblies)
    oprateData.assemblies = resetMeterail.assemblies
    oprateData.lines = resetMeterail.lines
    oprateData.parasiticAssemblies = resetMeterail.parasiticAssemblies
    oprateData.device = props.device
  }
  dragAssembly (ev, assemblyType) {
    ev.dataTransfer.setData('assembly', ev.target.id)
    ev.dataTransfer.setData('assemblyType', assemblyType)
  }
  materialDrop (ev) {
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (ev.dataTransfer.getData('assemblyType') !== 'PA') {
      actionMehodWapper.addAssmbly(ev.dataTransfer.getData('assembly'), position)
    } else {
      actionMehodWapper.addPAssmbly(ev.dataTransfer.getData('assembly'), position)
    }
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
    flag = true
    const { mode } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (mode.is('assembly')) {
      !actionMehodWapper.addAbleAddPointLine(position) && actionMehodWapper.addAbleMoveAssembly(position)
    }
    mode.is('line') && actionMehodWapper.addTemLine(position)
  }
  moveEnd (ev) {
    const { mode, ableMoveAssembly, temLine, ableAddPointLine } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (flag) {
      if (mode.is('assembly')) {
        util.clearObj(ableMoveAssembly)
        if (ableAddPointLine && Object.keys(ableAddPointLine).length) {
          actionMehodWapper.updateLinePositions(position)
        }
      }
      if (mode.is('line')) {
        const assemblyAtPosition = actionMehodWapper.findAssmblyByPosition(position)
        if (assemblyAtPosition && Object.keys(assemblyAtPosition).length) {
          actionMehodWapper.addLine(assemblyAtPosition)
        }
        util.clearObj(temLine)
      }
      flag = false
    }
  }
  move (ev) {
    const { mode, ableMoveAssembly, temLine } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (flag) {
      if (mode.is('assembly')) {
        if (Object.keys(ableMoveAssembly).length) {
          actionMehodWapper.updateAssemblyPosition(position)
        }
      }
      if (mode.is('line') && Object.keys(temLine).length) {
        actionMehodWapper.moveTemLine(position)
      }
    } else {
      if (mode.is('assembly')) {
        actionMehodWapper.showHoverAssembly()(position)
      }
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
    mode.is('assembly') && actionMehodWapper.deleteAssembly()
    mode.is('inLineChoosen') && actionMehodWapper.deleteLine()
  }
  getData = () => {
    if (this.props.getData) {
      this.props.getData({
        lines: oprateData.lines,
        assemblies: oprateData.assemblies
      })
    }
  }
  render() {
    const { material, typeSummary, parasiticAssembliseTypeSummary } = this.state
    const { assemblies, lines, parasiticAssemblies } = material
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
                          assemblies[assembly].typeBelong === type ? <div key={i} className={styles['small_assembly']}>
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
                            <div className={assemblies[assembly].showTip ? (`${styles['hover_div']} ${styles.show}`) : `${styles['hover_div']} ${styles.hide}`}>
                              <p>{assemblies[assembly].assemblyName}</p>
                              <img src={assemblies[assembly].imageUrl} />
                            </div>
                            <div className={styles['display_name']}>
                              {assemblies[assembly].assemblyName}
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
          {
            Object.keys(parasiticAssembliseTypeSummary).map(type => {
              return (
                <div key = {type}>
                  <p>{parasiticAssembliseTypeSummary[type]}</p>
                  <div>
                    {
                      Object.keys(parasiticAssemblies).map((assembly, i) => {
                        return (
                          parasiticAssemblies[assembly].typeBelong === type ? <div key={i} className={styles['small_assembly']}>
                            <img
                              alt={parasiticAssemblies[assembly].assemblyName}
                              className={styles['assembly-img']}
                              src={parasiticAssemblies[assembly].imageUrl}
                              id={assembly}
                              draggable={true}
                              onDragStart={(ev) => this.dragAssembly(ev, 'PA')}
                              onMouseEnter={() => { parasiticAssemblies[assembly].showTip = true; this.setState({ parasiticAssemblies }) }}
                              onMouseLeave={() => { parasiticAssemblies[assembly].showTip = false; this.setState({ parasiticAssemblies }) }}
                              style={{ width: '70%', height: '70%' }}
                            />
                            <div className={parasiticAssemblies[assembly].showTip ? (`${styles['hover_div']} ${styles.show}`) : `${styles['hover_div']} ${styles.hide}`}>
                              <p>{parasiticAssemblies[assembly].assemblyName}</p>
                              <img src={parasiticAssemblies[assembly].imageUrl} />
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
                    <div key={i} className={styles['small_assembly']}>
                      <img
                        className={!lines[line].isActive ? styles['line-img'] : styles['line-img-active']}
                        src={lines[line].imgSrc}
                        id={line} draggable={false}
                        onClick={(ev) => this.setActiveLine(ev, line, lines)}
                        onMouseEnter={() => { lines[line].showTip = true; this.setState({ lines }) }}
                        onMouseLeave={() => { lines[line].showTip = false; this.setState({ lines }) }}
                        style={{ width: '70%', height: '70%' }}
                      />
                      <div className={lines[line].showTip ? (`${styles['hover_div']} ${styles.show}`) : `${styles['hover_div']} ${styles.hide}`}>
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
            className={this.props.device === 'mobile' ? styles['canvas_mobile'] : styles['canvas_pc']}
          />
        </div>
        <div className={styles['action-field']}>
          <button onClick={this.narrowAssembly}>Narrow</button>
          <button onClick={this.enlargeAssembly}>Enlarge</button>
          <button onClick={this.deleteAssemblyOrLine}>Delete</button>
          <button onClick={this.getData}>Save</button>
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
