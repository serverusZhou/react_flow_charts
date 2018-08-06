import React, { Component } from 'react'
import styles from './index.less'

class Chart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imageItems: [
        {
          key: 'friend',
          imgSrc: 'https://bpic.588ku.com/element_banner/20/18/08/c16887b44516e93d5efee96383357d8a.jpg'
        }
      ]
    }
  }
  onDragstartFunc = (ev) => {
    console.log('draging')
    ev.dataTransfer.setData('Text', ev.target.id)
  }
  onDropFunc = (ev) => {
    console.log(ev)
  }
  allowDrop = (ev) => {
    ev.preventDefault()
  }
  render() {
    return (
      <div className={styles['flow-content']}>
        <div className={styles['left_side']}>
          {
            this.state.imageItems.map((obj, index) => {
              return (
                <img key={index} src={obj.imgSrc} id={obj.key} draggable={true} ref={'key' + index} onDragStart={(event) => this.onDragstartFunc(event)} />
              )
            })
          }
        </div>
        <div className={styles['content']} onDrop={(event) => this.onDropFunc(event)} onDragOver={(event) => this.allowDrop(event)}>
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
