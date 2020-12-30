<template>
  <div class="home">
    <div class="graphicsArea">
      <div class="theme">图形区域</div>
      <div class="graphics">
        <a v-for="(item, index) in tools"
           :key="index"
           :draggable="true"
           @dragstart="dragFn($event, item)">
          {{item.name}}
        </a>
      </div>
      <div class="control">
        <a href="javascript:" class="file button">
          <input type="file" ref="uploadFile" @change="handleFileChangeFn">
          打开文件
        </a>
        <div class="button" @click="saveFn">保存文件</div>
      </div>
    </div>
    <div class="drawingArea">
      <div class="canvas" id="topology-canvas"></div>
    </div>
    <div class="paramArea">
      <div class="theme">Engine Property</div>
      <div class="edit">
        <template v-if="current">
          <div class="param" v-for="(value, key) in param" :key="key">
            <div class="title">{{value}}：</div>
            <div class="value">{{current[key]}}</div>
          </div>
          <div class="param" v-for="(value, key) in current.params" :key="key">
            <div class="title">{{key}}：</div>
            <div class="value">{{value}}</div>
          </div>
          <div class="button right" @click="showFn">添加属性</div>
        </template>
      </div>
      <div class="internal"></div>
    </div>
    <div class="dialog"></div>
  </div>
</template>

<script>
import { registerNode, Topology } from '@topology/core'
import { saveAs } from 'file-saver'

import utils from '@/utils/index'
import { customShape, customAnchor } from '@/common/index'

export default {
  components: {
  },
  data () {
    return {
      canvas: null,
      canvasDom: null,
      canvasInfo: null,
      file: null,
      current: null,
      canvasOptions: {},
      history: {},
      topologyConfig: {
        nodes: [],
        lines: []
      },
      mapping: {},
      graphConfig: {
        engine: {},
        connect: []
      },
      param: {
        name: 'Name',
        inPin_RO: 'Input Pin',
        outPin_RO: 'Output Pin'
      },
      areaWideArr: [],
      areaHeightArr: [],
      simpleCoordinates: [],
      ...utils
    }
  },
  mounted () {
    this.graphicRegistrationFn()
    this.initFn()
  },
  methods: {
    // 图形注册
    graphicRegistrationFn () {
      Object.keys(this.tools).forEach((key) => {
        const {
          color,
          inPin_RO: to,
          outPin_RO: from
        } = this.tools[key]
        registerNode(key, customShape(color), customAnchor(to, from), null, null)
      })
    },
    getRandom (min, max) {
      return Math.round(Math.random() * (max - min) + min)
    },
    randomWord () {
      let code = ''
      for (let i = 0; i < 6; i += 1) {
        const type = this.getRandom(1, 3)
        switch (type) {
          case 1:
            code += String.fromCharCode(this.getRandom(48, 57))
            break
          case 2:
            code += String.fromCharCode(this.getRandom(65, 90))
            break
          case 3:
            code += String.fromCharCode(this.getRandom(97, 122))
            break
          default:
            break
        }
      }
      return code
    },
    addNodeFn ({
      id,
      name,
      inPin_RO: curInPinRo,
      outPin_RO: curOutPinRo,
      enableFlag,
      params
    }) {
      const {
        inPin_RO: toolInPinRo,
        outPin_RO: toolOutPinRo,
        enableFlag: toolEnableFlag,
        params: toolParams
      } = this.tools[name]
      this.mapping[id] = name
      this.graphConfig.engine[name] = {
        id,
        name,
        inPin_RO: curInPinRo || toolInPinRo,
        outPin_RO: curOutPinRo || toolOutPinRo,
        in_out_RO: [],
        enableFlag: enableFlag || toolEnableFlag,
        params: params || toolParams
      }
    },
    getEngineAnchorFn ({
      anchorIndex,
      id
    }, direction) {
      let anchor = anchorIndex
      const name = this.mapping[id]
      if (direction === 'src') {
        anchor -= this.tools[name].inPin_RO.length
      }
      return {
        [`${direction}Engine`]: name,
        [`${direction}PortId`]: anchor
      }
    },
    addLineFn ({ id, from, to }) {
      this.graphConfig.connect.push({
        id,
        enableFlag: true,
        ...this.getEngineAnchorFn(from, 'src'),
        ...this.getEngineAnchorFn(to, 'dst')
      })
    },
    deleteFn ([{ id, name }]) {
      const { connect, engine } = this.graphConfig
      const lineClass = ['curve', 'line']
      if (lineClass.includes(name)) {
        const index = connect.findIndex((item) => item.id === id)
        connect.splice(index, 1)
      } else {
        delete engine[this.mapping[id]]
        delete this.mapping[id]
      }
    },
    nodeFn ({ id }) {
      this.current = this.graphConfig.engine[this.mapping[id]]
    },
    lineFn ({ id }) {
      const { connect } = this.graphConfig
      const index = connect.findIndex((item) => item.id === id)
      console.log(index)
      // this.current = connect[index];
    },
    onMessageFn (event, data) {
      switch (event) {
        case 'addNode':
          this.addNodeFn(data)
          break
        case 'addLine':
          this.addLineFn(data)
          break
        case 'delete':
          this.deleteFn(data)
          break
        case 'node':
          this.nodeFn(data)
          break
        case 'line':
          this.lineFn(data)
          break
        default:
          break
      }
    },
    initFn () {
      this.canvasOptions.on = this.onMessageFn
      this.canvas = new Topology('topology-canvas', this.canvasOptions)
      this.canvasDom = document.querySelector('#topology-canvas')
      this.canvasInfo = this.canvasDom.getBoundingClientRect()
    },
    dragFn (event, item) {
      event.dataTransfer.setData('text/plain', JSON.stringify(item))
    },
    saveFn () {
      const { engine, connect } = this.graphConfig
      Object.keys(engine).forEach((key) => {
        delete engine[key].id
      })
      connect.forEach((item, index) => {
        delete connect[index].id
      })
      const blob = new Blob([JSON.stringify(this.graphConfig, null, 2)],
        { type: '' })
      saveAs(blob, 'test.json')
    },
    showFn () {
    },
    sumFn (arr) {
      return arr.reduce((total, curVal) => (total + curVal), 0)
    },
    maxFn (arr, index, value) {
      const array = arr
      const val = array[index]
      if (val) {
        if (val < value) array[index] = value
      } else array[index] = value
    },
    getSubsetFn (item, areaIndex) {
      this.simpleCoordinates[areaIndex] = []
      const areaArray = this.simpleCoordinates[areaIndex]
      const startSimple = {
        x: this.sumFn(this.areaWideArr) + 1,
        y: 1
      }
      this.history[item.name] = {
        ...startSimple
      }
      areaArray.push({
        ...startSimple,
        ...item
      })
      let oldLength
      let newLength
      let index = 0
      do {
        oldLength = areaArray.length
        const { name, x, y } = areaArray[index]
        const newY = y + 1
        this.maxFn(this.areaWideArr, areaIndex, x)
        this.maxFn(this.areaHeightArr, areaIndex, y)
        this.file.connect.forEach(({ srcEngine, dstEngine }) => {
          if (srcEngine === name) {
            if (this.history[dstEngine]) {
              this.simpleCoordinates.forEach((second, secIndex) => {
                second.forEach(({ name: curName, y: curY }, thiIndex) => {
                  if (curName === dstEngine && curY <= y) {
                    this.simpleCoordinates[secIndex][thiIndex].y = newY
                    this.history[dstEngine].y = newY
                  }
                })
              })
            } else {
              const lengthY = areaArray.filter(({ y: existedY }) => existedY === newY).length
              const subSimple = {
                x: this.history[srcEngine].x + lengthY,
                y: newY
              }
              this.history[dstEngine] = {
                ...subSimple
              }
              areaArray.push({
                ...this.file.engine[dstEngine],
                ...subSimple
              })
            }
          }
        })
        index += 1
        newLength = areaArray.length
      } while (newLength > oldLength || newLength > index)
    },
    conversionRoFn (obj, x, y) {
      const roObj = {}
      const roLength = obj.length
      const fixedWidth = this.unitWidth / (roLength + 1)
      obj.forEach((item, index) => {
        roObj[index] = {
          x: x + (index + 1) * fixedWidth,
          y
        }
      })
      return roObj
    },
    conversionNodeFn () {
      const arr = []
      this.simpleCoordinates.forEach((item) => {
        item.forEach(({
          x,
          y,
          name,
          inPin_RO: inPinRO,
          outPin_RO: outPinRO,
          ...ele
        }) => {
          const coordinateX = this.paddingLeft + (x * 2 - 2) * this.unitWidth
          const coordinateY = this.paddingTop + (y * 2 - 2) * this.unitHeight
          const coordinateInPinRO = this.conversionRoFn(inPinRO, coordinateX, coordinateY)
          const coordinateOutPinRO = this.conversionRoFn(outPinRO, coordinateX, coordinateY +
              this.unitHeight)
          const obj = {
            id: this.randomWord(),
            name,
            ...ele
          }
          this.history[name].inPinRO = coordinateInPinRO
          this.history[name].outPinRO = coordinateOutPinRO
          this.addNodeFn({
            inPin_RO: inPinRO,
            outPin_RO: outPinRO,
            ...obj
          })
          arr.push({
            text: name,
            rect: {
              x: coordinateX,
              y: coordinateY,
              width: this.unitWidth,
              height: this.unitHeight
            },
            inPinRO: coordinateInPinRO,
            outPinRO: coordinateOutPinRO,
            ...obj
          })
        })
      })
      return arr
    },
    getAnchorPositionFn (engine, anchor, ele) {
      const { x, y } = this.history[engine][ele][anchor]
      let anchorIndex = anchor
      if (ele === 'outPinRO') anchorIndex += this.tools[engine].inPin_RO.length
      return {
        x,
        y,
        anchorIndex,
        id: Object.keys(this.mapping).find((k) => this.mapping[k] === engine)
      }
    },
    conversionLineFn () {
      return this.file.connect.map(({
        srcEngine,
        srcPortId,
        dstEngine,
        dstPortId
      }) => {
        const id = this.randomWord()
        this.graphConfig.connect.push({
          id,
          enableFlag: true,
          srcEngine,
          srcPortId,
          dstEngine,
          dstPortId
        })
        const from = this.getAnchorPositionFn(srcEngine, srcPortId, 'outPinRO')
        const to = this.getAnchorPositionFn(dstEngine, dstPortId, 'inPinRO')
        return {
          id,
          name: 'line',
          lineWidth: 1,
          animateSpeed: 1,
          from,
          to,
          toArrow: 'triangleSolid'
        }
      })
    },
    // 绘制图像
    dataAnalysisFn () {
      const { engine, connect } = this.file
      const dstEngineArr = Array.from(new Set(connect.map(({ dstEngine }) => dstEngine)))
      const vertexEngine = []
      Object.keys(engine).forEach((key) => {
        if (!dstEngineArr.includes(key)) {
          vertexEngine.push(engine[key])
        }
      })
      this.mapping = {}
      this.graphConfig = {
        engine: {},
        connect: []
      }
      this.history = {}
      this.areaWideArr = []
      this.areaHeightArr = []
      this.simpleCoordinates = []
      vertexEngine.forEach((item, index) => {
        this.getSubsetFn(item, index)
      })
      const { width, height } = this.canvasInfo
      const totalHeight = this.sumFn(this.areaHeightArr)
      const totalWidth = this.sumFn(this.areaWideArr)
      const estimatedHeight = (totalHeight * 2 - 1) * this.unitHeight
      const estimatedWidth = (totalWidth * 2 - 1) * this.unitWidth
      if ((estimatedHeight + this.paddingTop * 2) < height) {
        this.paddingTop = (height - estimatedHeight) / 2
      }
      if ((estimatedWidth + this.paddingLeft * 2) < width) {
        this.paddingLeft = (width - estimatedWidth) / 2
      }
      this.topologyConfig.nodes = this.conversionNodeFn()
      this.topologyConfig.lines = this.conversionLineFn()
      this.canvas.open(this.topologyConfig)
    },
    handleFileChangeFn () {
      const [file] = this.$refs.uploadFile.files
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onerror = (e) => {
        console.log('读取文件异常', e)
      }
      reader.onload = (e) => {
        this.file = JSON.parse(e.target.result)
        this.dataAnalysisFn()
      }
    }
  }
}
</script>

<style lang="less">
  .home {
    display: flex;
    width: 100%;
    height: 100%;
    .theme {
      text-align: center;
      line-height: 50px;
      width: 100%;
      height: 50px;
      font-size: 21px;
      border-bottom: 1px solid #eee;
    }
    .graphicsArea {
      position: relative;
      width: 180px;
      height: 100%;
      .graphics {
        padding: 10px;
        a {
          display: inline-block;
          font-size: 12px;
          border-radius: 4px;
          padding: 10px;
          border: 1px solid #2c3e50;
          cursor: pointer;
        }
        a + a {
          margin-top: 10px;
        }
      }
      .control {
        position: absolute;
        width: 100%;
        height: 50px;
        bottom: 0;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        .file {
          position: relative;
          overflow: hidden;
          display: inline-block;
          text-decoration: none;
          input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
            filter: alpha(opacity=0);
            cursor: pointer
          }
        }
      }
    }
    .drawingArea {
      flex: 1;
      height: 100%;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
    .paramArea {
      position: relative;
      width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .edit {
        padding: 10px;
        flex: 1;
        border-bottom: 1px solid #eee;
        .param {
          font-size: 14px;
          line-height: 28px;
          div {
            display: inline-block;
          }
          .title {
            width: 80px;
            text-align: right;
          }
        }
      }
      .internal {
        height: 200px;
      }
    }
    .canvas {
      height: 100vh;
    }
    .button {
      display: inline-block;
      color: #888;
      background: #fafafa;
      border: 1px solid #ddd;
      padding: 4px 12px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        color: #444;
        background: #eee;
        border-color: #ccc;
      }
    }
    .button + .button {
      margin-left: 20px;
    }
    .right {
      float: right;
    }
  }
</style>
