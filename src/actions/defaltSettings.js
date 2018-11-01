
const allSettings = {}
Object.defineProperty(allSettings, 'assembly', {
  get: function() {
    return {
      id: 1111111,
      name: '',
      assemblyName: '',
      imageUrl: '',
      image: {},
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      positionPc: { x: 0, y: 0 },
      sizePc: { width: 0, height: 0 },
      insizeSpacePercent: [],
      lines: { from: [], to: [] },
      wapper: null, // parasiticAssembly
      belongs: [],
      highLevelAssembly: null,
      belowLevelAssembly: [],
      children: [], // wapperAssembly
      turnSetting: {},
      draw: () => {},
      acturalData: {}
    }
  }
})
Object.defineProperty(allSettings, 'parasiticAssemblySetting', {
  get: function() {
    return {
      id: 111111,
      name: '',
      assemblyName: '',
      imageUrl: '',
      image: {},
      belongsTo: {},
      ratio: 1,
      isOccupyInternalSpace: false,
      acturalData: {},
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      positionPc: { x: 0, y: 0 },
      sizePc: { width: 0, height: 0 },
      draw: () => {}
    }
  }
})
Object.defineProperty(allSettings, 'lineSetting', {
  get: function() {
    return {
      id: 111111,
      type: '',
      from: {
        assembly: null,
        position: { x: 0, y: 0 },
        positionPc: { x: 0, y: 0 }
      },
      to: {
        assembly: null,
        position: { x: 0, y: 0 },
        positionPc: { x: 0, y: 0 }
      },
      middlePoints: [],
      middlePointsPc: [],
      draw: () => {}
    }
  }
})
export default allSettings
