
import reactionPool from '../../assets/png/reaction_pool.png'

const typeBelong = 'pool'
const defaultSize = {
  width: 60,
  height: 100
}

const mostInsizeSpacePercent = [0, 0.2, 0.06, 0.2]

export default {
  inkWastewater: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '油墨废水调节池',
    size: defaultSize,
    insizeSpacePercent: mostInsizeSpacePercent
  },
  comprehensiveWasteWater: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '综合废水调节池',
    size: defaultSize,
    insizeSpacePercent: mostInsizeSpacePercent
  },
  acidAnalysisPool: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '酸析池',
    size: defaultSize,
    insizeSpacePercent: mostInsizeSpacePercent
  },
  firstLevelPool: {
    imageUrl: reactionPool,
    typeBelong,
    assemblyName: '一级综合反应池',
    size: defaultSize,
    insizeSpacePercent: mostInsizeSpacePercent
  },
}
