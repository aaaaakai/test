import { Point, Direction, AnchorMode } from '@topology/core'

export function customShape (color) {
  return (ctx, node) => {
    const canvas = ctx
    const {
      borderRadius,
      rect: {
        x, y, width, height
      }
    } = node
    let wr = borderRadius
    let hr = borderRadius
    if (borderRadius < 1) {
      wr = width * borderRadius
      hr = height * borderRadius
    }
    let r = wr < hr ? wr : hr
    if (width < 2 * r) { r = width / 2 }
    if (height < 2 * r) { r = height / 2 }
    canvas.beginPath()
    canvas.moveTo(x + r, y)
    canvas.arcTo(x + width, y, x + width, y + height, r)
    canvas.arcTo(x + width, y + height, x, y + height, r)
    canvas.arcTo(x, y + height, x, y, r)
    canvas.arcTo(x, y, x + width, y, r)
    canvas.strokeStyle = color
    canvas.closePath()
    if (node.fillStyle || node.bkType) canvas.fill()
    canvas.stroke()
  }
}

export function customAnchor (to, from) {
  const inLength = to.length + 1
  const outLength = from.length + 1
  return (node) => {
    const element = node
    const {
      rect: {
        x, y, width, height
      }
    } = element
    to.forEach((item, index) => {
      element.anchors.push(new Point(x + (width * (1 / inLength) * (index + 1)),
        y, Direction.Up))
      element.anchors[index].mode = AnchorMode.In
    })
    from.forEach((item, index) => {
      element.anchors.push(new Point(x + (width * (1 / outLength) * (index + 1)),
        y + height, Direction.Bottom))
      element.anchors[inLength + index - 1].mode = AnchorMode.Out
    })
  }
}
