import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss']
})
export class CarteiraComponent {

  dataSource: any;
  total = 0;


  public doughnutChartLabels: Label[] = ['Ações', 'Opções', 'ETF'];

  public doughnutChartData: MultiDataSet = [
    [0, 0, 0],
    [0, 0, 0],
  ];

  public doughnutChartType: ChartType = 'doughnut';
  //Chartype: pie, doughnut

  constructor(public firestore: AngularFirestore, ) { }

  ngOnInit() {
    this.Carregar();
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  Carregar(): void {
    this.firestore
      .collection(`proventos`)
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))))
      .subscribe(data => {
        this.dataSource = data;
        //this.total = this.dataSource[0].valor;
        this.total = this.dataSource.reduce((sum, item) => sum + item.valor, 0).toFixed(2);

        this.doughnutChartData = [
          [this.total, this.dataSource[0].valor * 5, this.dataSource[0].valor * 2],
          [10, 20, 40],
        ];
      });
  }


}


//   [350, 450, 100],
//   [50, 150, 120],
//   [250, 130, 70],
// ];