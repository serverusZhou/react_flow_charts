import deleteBtn from '../../assets/icon/delete.png'
import cancelChooseBtn from '../../assets/icon/cancel_choosen.png'
import circle from '../../assets/icon/circle.png'

function genImage(imageUrl) {
  const image = new Image()
  image.src = imageUrl
  return image
}
const defaultSize = { width: 20, height: 20 }
const btns = [
  {
    type: 'deleteBtn',
    imageUrl: deleteBtn,
    image: genImage(deleteBtn),
    sort: 1,
    size: defaultSize,
    position: {
      x: 0,
      y: 0
    },
    sizePc: defaultSize,
    positionPc: {
      x: 0,
      y: 0
    },
  },
  {
    type: 'cancelChooseBtn',
    imageUrl: cancelChooseBtn,
    image: genImage(cancelChooseBtn),
    sort: 2,
    size: defaultSize,
    position: {
      x: 40,
      y: 0
    },
    sizePc: defaultSize,
    positionPc: {
      x: 0,
      y: 0
    },
  }
]

const draftingPoints = [
  {
    type: 'topLeft',
    imageUrl: circle,
    image: genImage(circle),
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    },
    sizePc: {
      width: 20,
      height: 20
    },
    positionPc: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'topRight',
    imageUrl: circle,
    image: genImage(circle),
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    },
    sizePc: {
      width: 20,
      height: 20
    },
    positionPc: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'bottomLeft',
    imageUrl: circle,
    image: genImage(circle),
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    },
    sizePc: {
      width: 20,
      height: 20
    },
    positionPc: {
      x: 0,
      y: 0
    }
  },
  {
    type: 'bottomRight',
    imageUrl: circle,
    image: genImage(circle),
    size: {
      width: 20,
      height: 20
    },
    position: {
      x: 0,
      y: 0
    },
    sizePc: {
      width: 20,
      height: 20
    },
    positionPc: {
      x: 0,
      y: 0
    }
  }
]

export {
  btns,
  draftingPoints
}
