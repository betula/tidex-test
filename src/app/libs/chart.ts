
import {Data} from "../interfaces/data";
export default class Chart {

  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(
    canvasElement: HTMLCanvasElement,
    private data: Data
  ) {
    this.context = canvasElement.getContext('2d');
    this.width = canvasElement.width;
    this.height = canvasElement.height;
  }

  draw() {
    this.drawData();
  }

  drawData() {
    const
      paddingLeft = 2,
      paddingRight = 100,
      cellPaddingLeft = 2,
      cellPaddingRight = 2,
      data = this.data,
      maxH = Math.max(...data.h),
      minL = Math.min(...data.l),
      maxV = Math.max(...data.v),
      width = this.width,
      height = this.height,
      ctx = this.context,
      cellWidth = (width - paddingLeft - paddingRight) / data.t.length
    ;

    function getCellOffsets(index) {
      return {
        left: (cellWidth * index) + paddingLeft + cellPaddingLeft,
        width: cellWidth - cellPaddingRight - cellPaddingLeft
      }
    }

    function drawCandlestick(index) {
      const
        paddingTop = 15,
        paddingBottom = 15,
        o = data.o[index],
        c = data.c[index],
        h = data.h[index],
        l = data.l[index],
        scaleY = (height - paddingTop - paddingBottom) / (maxH - minL),
        cellOffsets = getCellOffsets(index),
        cellLeft = cellOffsets.left,
        cellWidth = cellOffsets.width,
        cellMiddle = cellLeft + cellWidth / 2,
        color = data.c[index] < data.o[index]
          ? 'rgb(198, 65, 72)'
          : 'rgb(5, 140, 108)'
      ;

      function translateY(y) {
        return height - ((y - minL) * scaleY + paddingBottom);
      }

      const
        bodyTop = translateY(Math.max(o, c)),
        bodyBottom = translateY(Math.min(o, c))
      ;

      ctx.beginPath();
      ctx.moveTo(Math.round(cellMiddle) + .5, Math.round(translateY(h)));
      ctx.lineTo(Math.round(cellMiddle) + .5, Math.round(translateY(l)));
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(cellLeft),
        Math.round(bodyBottom),
        Math.round(cellWidth),
        Math.round(bodyTop - bodyBottom)
      );
    }

    function drawValue(index) {
      const
        paddingBottom = 2,
        v = data.v[index],
        scaleY = height / 3 / maxV,
        cellOffsets = getCellOffsets(index),
        cellLeft = cellOffsets.left,
        cellWidth = cellOffsets.width,
        isDown = data.c[index] < data.o[index],
        strokeColor = isDown
          ? 'rgba(198, 65, 72, .5)'
          : 'rgba(5, 140, 108, .5)',
        fillColor = isDown
          ? 'rgba(198, 65, 72, .2)'
          : 'rgba(5, 140, 108, .2)'
      ;

      function translateY(v) {
        return height - (v * scaleY + paddingBottom);
      }

      const
        top = translateY(v),
        bottom = translateY(0)
      ;

      ctx.lineWidth = 1;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      ctx.fillRect(
        Math.round(cellLeft),
        Math.round(bottom),
        Math.round(cellWidth),
        Math.round(top - bottom)
      );
    }

    for(let i = 0; i < data.t.length; i++) {
      drawCandlestick(i);
      drawValue(i);
    }
  }


}
