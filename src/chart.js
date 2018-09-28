import React, { Component } from 'react'
import styles from './index.less'
import draw from './draw/draw'
import util from './util'
import actionMethod from './actionMehod'
import { btns, draftingPoints } from './material/btns'

const mode = util.keysSwith({ 'assembly': true, 'line': false, 'inLineChoosen': false })
let flag = false
let setTime = null
let alreadyInit = false
const oprateData = {
  mode, // 用来判断当前处于哪个操作模式中（组件还是连线或者其它）
  ctx: null,
  dom: { canvas: {}},
  assemblies: [],
  choosenAssembly: {},
  ableMoveAssembly: {},
  hoverAssembly: {},
  parasiticAssemblies: [],
  ableMovePAssembly: [],
  lines: [],
  choosenLine: {},
  activeLine: {},
  ableAddPointLine: {},
  temLine: {},
  actionBtns: {
    enable: false,
    btns,
    draftingPoints,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 }
  },
  ableDrafPoint: {},
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
    oprateData.material = props.material
    const resetMeterail = actionMehodWapper.resetAssembliesAndLines(props.assemblies, props.lines, props.parasiticAssemblies)
    oprateData.assemblies = resetMeterail.assemblies
    oprateData.lines = resetMeterail.lines
    oprateData.parasiticAssemblies = resetMeterail.parasiticAssemblies
    oprateData.device = props.device
    const openMap = {
      ...Object.keys(this.props.typeSummary).reduce((ev, type) => { ev[type] = false; return ev }, {}),
      ...Object.keys(this.props.parasiticAssembliseTypeSummary).reduce((ev, type) => { ev[type] = false; return ev }, {}),
      line: false
    }
    this.state = { ...props, openMap }
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
    if (flag) { flag = false; return false }
    const { mode, choosenLine, choosenAssembly, ableMovePAssembly, lines, ableAddPointLine } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (!mode.is('line')) {
      mode.setTo('assembly')
      util.clearObj(choosenLine)
      util.clearObj(ableMovePAssembly)
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        if (actionMehodWapper.takeAction(position)) {
          return
        }
      }
      if (ableAddPointLine && Object.keys(ableAddPointLine).length) {
        const line = lines.find(element => !!ableAddPointLine[element.id])
        if (line) {
          line.middlePoints.splice(ableAddPointLine[line.id].belongIndex, 1)
          util.clearObj(ableAddPointLine)
        }
      }
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
    setTime = setTimeout(() => { flag = true }, 150)
    const { mode, choosenAssembly } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (mode.is('assembly')) {
      if (choosenAssembly && Object.keys(choosenAssembly).length) {
        !actionMehodWapper.addAbleMovePAssembly(position) && actionMehodWapper.addAbleMoveDragingPoint(position)
      } else {
        !actionMehodWapper.addAbleAddPointLine(position) && actionMehodWapper.addAbleMoveAssembly(position)
      }
    }
    mode.is('line') && actionMehodWapper.addTemLine(position)
  }
  moveEnd (ev) {
    clearTimeout(setTime)
    const { mode, ableMoveAssembly, ableMovePAssembly, choosenAssembly, temLine, ableAddPointLine, ableDrafPoint } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (flag) {
      if (mode.is('assembly')) {
        util.clearObj(ableMoveAssembly)
        if (choosenAssembly && Object.keys(choosenAssembly).length) {
          actionMehodWapper.dealWithPAssemblyAction(position)
        }
        if (ableAddPointLine && Object.keys(ableAddPointLine).length) {
          actionMehodWapper.setLinePositions(position)
          util.clearObj(ableAddPointLine)
        }
        if (ableMovePAssembly && Object.keys(ableMovePAssembly).length) {
          util.clearObj(ableMovePAssembly)
        }
        if (ableDrafPoint && Object.keys(ableDrafPoint).length) {
          util.clearObj(ableDrafPoint)
        }
      }
      if (mode.is('line')) {
        const assemblyAtPosition = actionMehodWapper.findAssmblyByPosition(position)
        if (assemblyAtPosition && Object.keys(assemblyAtPosition).length) {
          actionMehodWapper.addLine(assemblyAtPosition)
        }
        util.clearObj(temLine)
      }
    }
  }
  move (ev) {
    const { mode, ableMoveAssembly, ableMovePAssembly, temLine, ableDrafPoint, ableAddPointLine } = oprateData
    const position = actionMehodWapper.transPixelToPos({
      x: ev.clientX,
      y: ev.clientY
    })
    if (flag) {
      if (mode.is('assembly')) {
        if (Object.keys(ableMoveAssembly).length) {
          actionMehodWapper.updateAssemblyPosition(position)
        }
        if (ableAddPointLine && Object.keys(ableAddPointLine).length) {
          actionMehodWapper.updateLinePositions(position)
        }
        if (Object.keys(ableMovePAssembly).length) {
          actionMehodWapper.updatePAssemblyPosition(position)
        }
        if (Object.keys(ableDrafPoint).length) {
          actionMehodWapper.updateDrafPointPosition(position)
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
        assemblies: oprateData.assemblies,
        parasiticAssemblies: oprateData.parasiticAssemblies,
      })
    }
  }
  handelKeyboardAction = (keyCode) => {
    const { choosenAssembly } = oprateData
    if (keyCode === 187) {
      if (choosenAssembly && Object.keys(choosenAssembly)) {
        this.enlargeAssembly()
      }
    }
    if (keyCode === 189) {
      if (choosenAssembly && Object.keys(choosenAssembly)) {
        this.narrowAssembly()
      }
    }
    if (keyCode === 46) {
      if (choosenAssembly && Object.keys(choosenAssembly)) {
        this.deleteAssemblyOrLine()
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    oprateData.material = nextProps.material
    // const resetMeterail = actionMehodWapper.resetAssembliesAndLines(
    //   !nextProps.assemblies.length ? nextProps.assemblies : preProps.assemblies,
    //   !nextProps.lines.length ? nextProps.lines : preProps.lines,
    //   !nextProps.parasiticAssemblies.length ? nextProps.parasiticAssemblies : preProps.parasiticAssemblies)
    // oprateData.assemblies = resetMeterail.assemblies
    // oprateData.lines = resetMeterail.lines
    // oprateData.parasiticAssemblies = resetMeterail.parasiticAssemblies
    oprateData.device = nextProps.device
  }
  componentDidUpdate() {
    if (!this.props.disabled && !alreadyInit && this.refs['flow_canvas']) {
      this.flowInit()
    }
  }
  flowInit = () => {
    oprateData.dom.content = this.refs['flow_content']
    oprateData.dom.canvas = this.refs['flow_canvas']
    oprateData.dom.canvas.addEventListener('keydown', (ev) => {
      this.handelKeyboardAction(ev.keyCode)
    }, true)
    oprateData.dom.canvas.focus()
    drawWapper.init()
  }
  render() {
    const { material, typeSummary, parasiticAssembliseTypeSummary, openMap } = this.state
    const { assemblies, lines, parasiticAssemblies } = material
    return (
      <div className={styles['flow-content']} ref='flow_content'>
        <div className={styles['left_side']}>
          <div>
            {
              this.props.children
            }
          </div>
          {
            Object.keys(typeSummary).map(type => {
              return (
                <div key = {type}>
                  <p
                    className={openMap[type] ? styles.up : styles.down}
                    onClick={() => this.setState({ openMap: {
                      ...openMap,
                      [type]: !openMap[type]
                    }})}
                  >
                    {typeSummary[type]}
                  </p>
                  <div className={openMap[type] ? '' : styles.hidden}>
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
                  <p
                    className={openMap[type] ? styles.up : styles.down}
                    onClick={() => this.setState({ openMap: {
                      ...openMap,
                      [type]: !openMap[type]
                    }})}
                  >
                    {parasiticAssembliseTypeSummary[type]}
                  </p>
                  <div className={openMap[type] ? '' : styles.hidden}>
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
            <p
              className={openMap['line'] ? styles.up : styles.down}
              onClick={() => {
                this.setState({
                  openMap: {
                    ...openMap,
                    line: !openMap['line']
                  }
                })
              }}
            >线条（点击选中进行连线）</p>
            <div className={openMap['line'] ? '' : styles.hidden}>
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
          {
            this.props.btns && <div className={styles.extra_btn}>
              {this.props.btns}
            </div>
          }
          <p className={styles.charts_title}>{this.props.title}</p>
          {
            !this.props.disabled ? <div className={this.props.device === 'mobile' ? styles['canvas_mobile'] : styles['canvas_pc']}>
              <canvas
                ref='flow_canvas'
                onClick={(ev) => this.chooseAssembly(ev, this.props.chooseAssembly)}
                onMouseDown={(event) => this.moveStart(event)}
                onMouseUp={event => this.moveEnd(event)}
                onMouseOut={event => this.moveEnd(event)}
                onMouseMove={(event) => this.move(event)}
                style={{ width: '100%', height: '100%' }}
                tabIndex='0'
              />
            </div> : <div className={this.props.device === 'mobile' ? styles['canvas_mobile'] : styles['canvas_pc']}>
              <div style={{ width: '100%', height: '100%' }} className={styles.forbid} />
            </div>
          }
        </div>
      </div>
    )
  }
  componentDidMount() {
    if (!this.refs['flow_canvas']) {
      return
    }
    this.flowInit()
    alreadyInit = true
  }
}
export default Chart
