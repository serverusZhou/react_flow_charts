import React, { Component } from 'react'

class Chart extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <aside>左边组件部分</aside>
        <div>
          <canvas ref='flow_canvas' />
        </div>
      </div>
    )
  }
  componentDidMount() {
    console.log(this.refs['flow_canvas'])
  }
  componentWillReceiveProps(nextProps, preProps) {
    console.log('nextPropsnextProps', nextProps)

    console.log('prePropsprePropspreProps', preProps)
  }
}

export default Chart
