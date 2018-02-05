
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
    const
      axisRightWidth = 200,
      axisRightPaddingLeft = 2,
      axisBottomHeight = 40,
      axisBottomPaddingTop = 2,
      axisColor = 'rgba(0, 0, 0, .2)',
      axisMarkWidth = 5,
      chartPaddingLeft = 2,
      chartPaddingRight = 100 + axisRightWidth,
      cellPaddingLeft = 2,
      cellPaddingRight = 2,
      data = this.data,
      maxH = Math.max(...data.h),
      minL = Math.min(...data.l),
      maxV = Math.max(...data.v),
      width = this.width,
      height = this.height,
      ctx = this.context,
      cellWidth = (width - chartPaddingLeft - chartPaddingRight) / data.t.length
    ;

    function getCellOffsets(index) {
      return {
        left: (cellWidth * index) + chartPaddingLeft + cellPaddingLeft,
        width: cellWidth - cellPaddingRight - cellPaddingLeft
      }
    }

    function drawValuesChart() {

      function drawValue(index) {
        const
          chartPaddingBottom = 2 + axisBottomHeight,
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
          return height - (v * scaleY + chartPaddingBottom);
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
        drawValue(i);
      }
    }

    function drawCandlesticksChart() {
      const
        chartPaddingTop = 15,
        chartPaddingBottom = 15 + axisBottomHeight,
        scaleY = (height - chartPaddingTop - chartPaddingBottom) / (maxH - minL)
      ;

      function translateY(y) {
        return height - ((y - minL) * scaleY + chartPaddingBottom);
      }

      function drawCandlestick(index) {
        const
          o = data.o[index],
          c = data.c[index],
          h = data.h[index],
          l = data.l[index],
          cellOffsets = getCellOffsets(index),
          cellLeft = cellOffsets.left,
          cellWidth = cellOffsets.width,
          cellMiddle = cellLeft + cellWidth / 2,
          color = data.c[index] < data.o[index]
            ? 'rgb(198, 65, 72)'
            : 'rgb(5, 140, 108)',
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

      function drawLastClose() {
        const
          labelRectHeight = 30,
          labelColor = 'rgb(255, 255, 255)',
          labelFont = '25px Arial',
          labelFontHeight = 25,
          labelPaddingLeft = 5,
          labelPaddingBottom = 3,
          labelPaddingRight = 5,
          index = data.t.length - 1,
          labelText = String(data.c[index]),
          isDown = data.c[index] < data.o[index],
          color = isDown
            ? 'rgb(198, 65, 72)'
            : 'rgb(5, 140, 108)',
          y = translateY(data.c[index]),
          rectX = width - axisRightWidth + axisRightPaddingLeft + axisMarkWidth
        ;
        let
          rectWidth
        ;

        ctx.beginPath();
        ctx.moveTo(0, Math.round(y) + .5);
        ctx.lineTo(Math.round(rectX), Math.round(y) + .5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();

        ctx.font = labelFont;
        rectWidth = ctx.measureText(labelText).width + labelPaddingLeft + labelPaddingRight;

        ctx.fillStyle = color;
        ctx.fillRect(
          Math.round(Math.round(rectX)),
          Math.round(Math.round(y - labelRectHeight / 2)),
          Math.round(rectWidth),
          Math.round(labelRectHeight)
        );

        ctx.textAlign = 'left';
        ctx.fillStyle = labelColor;
        ctx.fillText(
          labelText,
          Math.round(rectX + labelPaddingLeft),
          Math.round(y + labelFontHeight / 2 - labelPaddingBottom)
        );
      }

      function drawBottomAxis() {
        const
          axisLabelColor = 'rgba(0, 0, 0, .8)',
          axisLabelFont = 'bold 20px Arial',
          axisLabelFontOffset = 25,
          timeMarkLimit = 10,
          timeIntervalDictionary = [ 1, 5, 30, 60, 90, 120 ],
          len = data.t.length,
          maxT = data.t[len - 1],
          minT = data.t[0],
          timeMaxInterval = Math.ceil((maxT - minT) / 60) / timeMarkLimit,

          firstCellOffsets = getCellOffsets(0),
          minX = firstCellOffsets.left + firstCellOffsets.width / 2,
          lastCellOffsets = getCellOffsets(len - 1),
          maxX = lastCellOffsets.left + lastCellOffsets.width / 2,

          scaleX = (maxX - minX) / (maxT - minT),
          axisY = height - (axisBottomHeight - axisBottomPaddingTop)

        ;
        let
          timeInterval = timeIntervalDictionary[0],
          markList = []
        ;

        function translateX(t) {
          return (t - minT) * scaleX + minX;
        }

        for (let i = timeIntervalDictionary.length - 1; i >= 0; i++ ) {
          if (timeIntervalDictionary[i] >= timeMaxInterval) {
            timeInterval = timeIntervalDictionary[i];
          } else {
            break;
          }
        }

        markList.push(
          maxT - (maxT % (timeInterval * 60))
        );
        while (true) {
          let next = markList[0] - timeInterval * 60;
          if (next < minT) {
            break;
          }
          markList.unshift(next);
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = axisColor;

        ctx.beginPath();
        ctx.moveTo(0, Math.round(axisY) + .5);
        ctx.lineTo(width - axisRightWidth + axisRightPaddingLeft, Math.round(axisY) + .5);
        ctx.stroke();
        ctx.closePath();

        for (let time of markList) {
          const x = translateX(time);
          ctx.beginPath();
          ctx.moveTo(Math.round(x) + .5, Math.round(axisY));
          ctx.lineTo(Math.round(x) + .5, Math.round(axisY + axisMarkWidth));
          ctx.stroke();
          ctx.closePath();

          const date = new Date(time * 1000);
          const minutes = ('0' + date.getMinutes()).slice(-2);
          const hours = ('0' + date.getHours()).slice(-2);

          ctx.fillStyle = axisLabelColor;
          ctx.font = axisLabelFont;
          ctx.textAlign = 'center';
          ctx.fillText(hours + ':' + minutes, Math.round(x), Math.round(axisY + axisLabelFontOffset));
        }

      }

      function drawRightAxis() {
        const
          axisX = width - axisRightWidth + axisRightPaddingLeft
        ;

        ctx.lineWidth = 1;
        ctx.strokeStyle = axisColor;

        ctx.beginPath();
        ctx.moveTo(Math.round(axisX) + .5, 0);
        ctx.lineTo(Math.round(axisX) + .5, Math.round(height - (axisBottomHeight - axisBottomPaddingTop)) + .5);
        ctx.stroke();
        ctx.closePath();
      }

      drawBottomAxis();
      drawRightAxis();

      for(let i = 0; i < data.t.length; i++) {
        drawCandlestick(i);
      }
      drawLastClose();

    }

    drawValuesChart();
    drawCandlesticksChart();
  }


}
