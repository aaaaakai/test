const tools = {
  'AsyncEngine.Apu': {
    text: 'AsyncEngine.Apu',
    name: 'AsyncEngine.Apu',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0],
    outPin_RO: [0],
    color: '#409EFF'
  },
  'AsyncEngine.Custom': {
    text: 'AsyncEngine.Custom',
    name: 'AsyncEngine.Custom',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0],
    outPin_RO: [0],
    color: '#E6A23C'
  },
  'AsyncEngine.D2H_ApuRes': {
    text: 'AsyncEngine.D2H_ApuRes',
    name: 'AsyncEngine.D2H_ApuRes',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0],
    outPin_RO: [0],
    color: '#F56C6C'
  },
  'AsyncEngine.D2H_DecRes': {
    text: 'AsyncEngine.D2H_DecRes',
    name: 'AsyncEngine.D2H_DecRes',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0],
    outPin_RO: [0, 1],
    color: '#909399'
  },
  'AsyncEngine.D2H_IpeRes': {
    text: 'AsyncEngine.D2H_IpeRes',
    name: 'AsyncEngine.D2H_IpeRes',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0],
    outPin_RO: [0, 1],
    color: '#606266'
  },
  'AsyncEngine.H2D_Device': {
    text: 'AsyncEngine.H2D_Device',
    name: 'AsyncEngine.H2D_Device',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0, 1],
    outPin_RO: [0, 1, 2],
    params: {
      params_1: 100,
      params_2: 'H2D_Device',
      debug_flag: true
    },
    color: '#409eff'
  },
  'AsyncEngine.Ipe': {
    text: 'AsyncEngine.Ipe',
    name: 'AsyncEngine.Ipe',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0, 1],
    outPin_RO: [0],
    color: '#e8f3fe'
  },
  'AsyncEngine.Vdec': {
    text: 'AsyncEngine.Vdec',
    name: 'AsyncEngine.Vdec',
    rect: {
      width: 200,
      height: 50
    },
    inPin_RO: [0],
    outPin_RO: [0],
    params: {
      params_1: 101,
      params_2: 'Vdec',
      debug_flag: true
    },
    color: '#ff8484'
  }
}
const unitHeight = 50
const unitWidth = 200
const paddingTop = 100
const paddingLeft = 100

export default {
  tools,
  unitHeight,
  unitWidth,
  paddingTop,
  paddingLeft
}
