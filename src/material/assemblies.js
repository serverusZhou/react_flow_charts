
import reactionPool from '../../assets/png/reaction_pool.png'

const typeBelong = 'pool'
const defaultSize = {
  width: 100,
  height: 100
}

export default {
  inkWastewater: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '油墨废水调节池',
    size: defaultSize,
  },
  comprehensiveWasteWater: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '综合废水调节池',
    size: defaultSize,
  },
  acidAnalysisPool: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '酸析池',
    size: defaultSize,
  },
  firstLevelPool: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '一级综合反应池',
    size: defaultSize,
  },
}
