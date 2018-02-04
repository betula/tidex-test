import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  template: `
    <app-chart *ngIf="data" [data]="data"></app-chart>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  data: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://web.tidex.com/api/chart/history?symbol=8&resolution=15&from=1517600000&to=1517659543')
      .subscribe((data) => {
        this.data = data;
      });
  }

}
