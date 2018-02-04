
import {Data} from "../interfaces/data";
export default class Chart {

  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  time: number[];
  main: any;

  constructor(
    canvasElement: HTMLCanvasElement,
    private data: Data
  ) {
    this.context = canvasElement.getContext('2d');
    this.width = canvasElement.width;
    this.height = canvasElement.height;
  }

  draw() {
    this.drawCandlesticks();
    this.drawValues();
  }

  drawCandlesticks() {
    const
      paddingTop = 15,
      paddingBottom = 15,
      paddingLeft = 2,
      paddingRight = 100,
      cellPaddingLeft = 2,
      cellPaddingRight = 2,
      data = this.data,
      width = this.width,
      height = this.height,
      ctx = this.context,
      maxY = Math.max(...data.h),
      minY = Math.min(...data.l),
      scaleY = (height - paddingTop - paddingBottom) / (maxY - minY),
      cellWidth = (width - paddingLeft - paddingRight) / data.t.length
    ;

    function translateY(y) {
      return height - ((y - minY) * scaleY + paddingBottom);
    }

    function getCellOffsets(index) {
      return {
        left: (cellWidth * index) + paddingLeft + cellPaddingLeft,
        width: cellWidth - cellPaddingRight - cellPaddingLeft
      }
    }

    function drawCandlestick(index) {
      const
        o = data.o[index],
        c = data.c[index],
        h = data.h[index],
        l = data.l[index],
        bodyTop = translateY(Math.max(o, c)),
        bodyBottom = translateY(Math.min(o, c)),
        cellOffsets = getCellOffsets(index),
        cellLeft = cellOffsets.left,
        cellWidth = cellOffsets.width,
        cellMiddle = Math.round(cellLeft + cellWidth / 2),
        color = data.c[index] < data.o[index] ? 'red' : 'green'
      ;

      ctx.beginPath();
      ctx.moveTo(cellMiddle + .5, translateY(h));
      ctx.lineTo(cellMiddle + .5, translateY(l));
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fillRect(cellLeft + .5, bodyBottom + .5, cellWidth, bodyTop - bodyBottom);
    }

    for(let i = 0; i < data.t.length; i++) {
      drawCandlestick(i);
    }
  }

  drawValues() {

  }

}
