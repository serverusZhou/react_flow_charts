import React, { Component } from 'react'
import draw from './draw/pcDraw'
import util from './util'
import actionMethod from './actionMehod'
import { btns, draftingPoints } from './material/btns'
import { others } from './material/other'

const mode = util.keysSwith({ 'assembly': true, 'line': false, 'inLineChoosen': false })
let flag = false
const oprateData = {
  mode, // 用来判断当前处于哪个操作模式中（组件还是连线或者其它）
  ctx: null,
  dom: { canvas: {}},
  destroy: false,
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
  inputs: [],
  ableMoveInput: {},
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
    others
  }
}

const drawWapper = draw(oprateData)
const actionMehodWapper = actionMethod(oprateData)

class Chart extends Component {
  constructor (props) {
    super(props)
    oprateData.material = props.material
    oprateData.material.others = others
    const resetMeterail = actionMehodWapper.resetAssembliesAndLines(props.assemblies, props.lines, props.parasiticAssemblies)
    oprateData.assemblies = resetMeterail.assemblies
    oprateData.lines = resetMeterail.lines
    oprateData.parasiticAssemblies = resetMeterail.parasiticAssemblies
    oprateData.device = 'pc'
    const openMap = {
      ...Object.keys(this.props.typeSummary).reduce((ev, type) => { ev[type] = false; return ev }, {}),
      ...Object.keys(this.props.parasiticAssembliseTypeSummary).reduce((ev, type) => { ev[type] = false; return ev }, {}),
      line: false,
      other: false
    }
    this.state = { ...props, openMap, showPc: false, mode: 'asm' }
  }
  chooseAssembly (ev, chooseAsmCallBack, chooseLineCallBack, clearChoose) {
    if (flag) { flag = false; return false }
    const { mode, choosenLine, choosenAssembly, ableMovePAssembly, lines, ableAddPointLine, device } = oprateData
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
          if (device === 'mobile') {
            line.middlePoints.splice(ableAddPointLine[line.id].belongIndex, 1)
          }
          if (device === 'pc') {
            line.middlePointsPc.splice(ableAddPointLine[line.id].belongIndex, 1)
          }
          util.clearObj(ableAddPointLine)
        }
      }
      util.clearObj(choosenAssembly)
      const line = actionMehodWapper.chooseLine(position)
      if (line) {
        mode.setTo('inLineChoosen')
        if (chooseLineCallBack) {
          chooseLineCallBack(Object.assign({}, line), {})
        }
        return
      }
      const assembly = actionMehodWapper.chooseAssmbly(position)
      if (assembly) {
        if (chooseAsmCallBack) {
          chooseAsmCallBack(Object.assign({}, assembly), {
            updateActuralData: (acturalData) => {
              actionMehodWapper.updateChoosenAssemblyActuralData(acturalData)
            },
            addJumppingPoint: (inOrOut, displayName, acturalData) => {
              if (inOrOut === 'in') {
                actionMehodWapper.addPAssmbly('jumppingIntPoint', { x: assembly.position.x + 10, y: assembly.position.y + 10 }, displayName, acturalData)
              }
              if (inOrOut === 'out') {
                actionMehodWapper.addPAssmbly('jumppingOutPoint', { x: assembly.position.x + 10, y: assembly.position.y + 10 }, displayName, acturalData)
              }
            },
            deletePAssembly: (deletePAssembly) => {
              actionMehodWapper.deletePAssembly(deletePAssembly)
            },
            updatePAssemblyActuralData: (pAssembly, acturalData) => {
              actionMehodWapper.updatePAssemblyActuralData(pAssembly, acturalData)
            },
            updateChoosenAssemblyPosition: (position) => {
              actionMehodWapper.updateChoosenAssemblyPosition(position)
            },
            updateChoosenAssemblySize: (size) => {
              actionMehodWapper.updateChoosenAssemblySize(size)
            }
          })
        }
        return
      }
      clearChoose()
    }
  }
  componentWillReceiveProps(nextProps) {
    oprateData.material = nextProps.material
    oprateData.material.others = others
    if (nextProps.shouldUpdate) {
      const resetMeterail = actionMehodWapper.resetAssembliesAndLines(
        nextProps.assemblies.length ? nextProps.assemblies : this.props.assemblies,
        nextProps.lines.length ? nextProps.lines : this.props.lines,
        nextProps.parasiticAssemblies.length ? nextProps.parasiticAssemblies : this.props.parasiticAssemblies)
      oprateData.assemblies = resetMeterail.assemblies
      oprateData.lines = resetMeterail.lines
      oprateData.parasiticAssemblies = resetMeterail.parasiticAssemblies
      oprateData.choosenAssembly = {}
      oprateData.actionBtns.enable = false
    }
  }
  flowInit = () => {
    oprateData.dom.canvas = this.refs['flow_canvas']
    drawWapper.init(2500, 2500)
    if (this.props.getInitCallBackFuncs) {
      this.props.getInitCallBackFuncs({
        updateAsmActuralData: (assembly, acturalData) => {
          actionMehodWapper.updateAsmActuralData(assembly, acturalData)
        },
        updatePAssemblyActuralData: (pAssembly, acturalData) => {
          actionMehodWapper.updatePAssemblyActuralData(pAssembly, acturalData)
        },
        updateRightAsmPosition: (assembly, position) => {
          return actionMehodWapper.updateRightAsmPosition(assembly, position)
        },
        deleteAssembly: (assembly) => {
          const { choosenAssembly, assemblies } = oprateData
          actionMehodWapper.deleteRightAssembly(assembly)
          return assemblies.find(asm => choosenAssembly[asm.id])
        },
        changeAssemblyDisplayName: (assembly, name) => {
          const { assemblies } = oprateData
          const atAsm = assemblies.find(asm => asm.id === assembly.id)
          if (atAsm) {
            atAsm.displayName = name
            return atAsm
          }
        },
        updateAssemblyStatus: (assembly, status) => {
          actionMehodWapper.updateAsmStatus(assembly, status)
        },
        updatePAssemblyStatus: (pAsm, status) => {
          actionMehodWapper.updatePAsmStatus(pAsm, status)
        },
        changeLineType: (line, type) => {
          return actionMehodWapper.updateLineType(line, type)
        },
        updateLineState: (line, type) => {
          return actionMehodWapper.updateLineState(line, type)
        },
        addMiddlePoint: (line, point) => {
          return actionMehodWapper.addMiddlePoint(line, point)
        },
        addJumppingPoint: (asm, inOrOut, displayName, acturalData) => {
          if (inOrOut === 'in') {
            return actionMehodWapper.addPAssmblyWithBelongTo('jumppingIntPoint', asm, displayName, acturalData)
          }
          if (inOrOut === 'out') {
            return actionMehodWapper.addPAssmblyWithBelongTo('jumppingOutPoint', asm, displayName, acturalData)
          }
        },
        deleteLine: (line) => {
          actionMehodWapper.deleteRightLine(line)
        },
        getAllOprateData: () => {
          return oprateData
        }
      })
    }
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <canvas
          ref='flow_canvas'
          onClick={(ev) => this.chooseAssembly(ev, this.props.chooseAssembly, this.props.chooseLine, this.props.clearChoose)}
          style={{ width: '100%', height: '100%' }}
          tabIndex='0'
        />
      </div>
    )
  }
  componentDidMount() {
    oprateData.destroy = false
    if (!this.refs['flow_canvas']) {
      return
    }
    this.flowInit(2500, 2500)
  }
  componentWillUnmount() {
    oprateData.destroy = true
  }
}
export default Chart
