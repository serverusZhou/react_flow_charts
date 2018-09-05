import deleteBtn from '../../assets/icon/delete.png'
import cancelChooseBtn from '../../assets/icon/cancel_choosen.png'
import circle from '../../assets/icon/circle.png'

const defaultSize = { width: 20, height: 20 }
const btns = [
  {
    type: 'deleteBtn',
    imageUrl: deleteBtn,
    sort: 1,
    size: defaultSize,
    position: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'cancelChooseBtn',
    imageUrl: cancelChooseBtn,
    sort: 2,
    size: defaultSize,
    position: {
      x: 40,
      y: 0
    }
  }
]

const draftingPoints = [
  {
    type: 'topLeft',
    imageUrl: circle,
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'topRight',
    imageUrl: circle,
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'bottomLeft',
    imageUrl: circle,
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'bottomRight',
    imageUrl: circle,
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    }
  }
]

export {
  btns,
  draftingPoints
}
