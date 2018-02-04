import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import Chart from "../../libs/chart";

@Component({
  selector: 'app-chart',
  template: `
    <canvas #canvas width="1600" height="600"></canvas>
  `,
  styles: [`
    canvas {
      width: 800px;
      height: 300px;
    }
  `]
})
export class ChartComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef: ElementRef;
  @Input() data;

  constructor() { }

  ngAfterViewInit() {
    const chart = new Chart(this.canvasRef.nativeElement, this.data);
    chart.draw();
  }

}
