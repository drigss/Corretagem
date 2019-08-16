import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { CadastroProventosComponent } from 'src/app/forms/cadastro-proventos/cadastro-proventos.component';
import { Observable } from 'rxjs';
import { Proventos } from 'src/app/models/proventos';

@Component({
  selector: 'app-proventos',
  templateUrl: './proventos.component.html',
  styleUrls: ['./proventos.component.scss']
})
export class ProventosComponent implements OnInit {

  public displayedColumns = ['select', 'nome', 'data', 'tipo', 'papel', 'valor'];
  public dataSource = [];
  selection = new SelectionModel<string>(true, []);
  dataLength: number;
  Carregando: Boolean = false;
  Pesquisa: any = {};
  proventos$: Observable<Proventos[]>;
  total: number = 0;
  totalX = 2;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    private db: AngularFirestore) { }

  ngOnInit() {
    this.Pesquisa.descricao = '';
    this.Carregar(null);
    this.proventos$ = this.db.collection<Proventos>('/proventos').valueChanges();
  }

  Carregar(event: PageEvent): void {
    this.Carregando = true;
    this.firestore
      .collection(`proventos`)
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))))
      .subscribe(data => {
        this.dataSource = data;
        this.Carregando = false;

        //Soma dos valores
        // console.log(this.dataSource);

        //this.total = 0;
        // for (var i = 0; i < this.dataSource.length; i++) {
        //   this.total += this.dataSource[i].valor;
        // }
        // this.total = parseFloat(this.total.toFixed(2));

        //this.dataSource[2].valor

        this.total = this.dataSource.reduce((sum, item) => sum + item.valor, 0).toFixed(2);

        // this.totalX = this.dataSource[0].valor +  this.dataSource[0].valor;

      });
  }

  NovoRegistro(): void {
    const dialogRef = this.dialog.open(CadastroProventosComponent, {
      width: '800px',
      hasBackdrop: true,
      disableClose: true,
      data: { id: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Carregar(null);
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.forEach(row => this.selection.select(row.id));
  }

  ExcluirSelecionados(): void {
    if (this.selection.selected.length > 0) {
      swal
        .fire({
          title: 'Atenção',
          text: 'Deseja excluir o(s) registro(s) selecionado(s)?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        })
        .then(result => {
          if (result.value) {
            this.selection.selected.forEach(item => {
              this.firestore.doc(`proventos/` + item).delete();
            });
          }
        });
    } else {
      swal.fire('Atenção!', 'Selecione algum registro para excluir!', 'warning');
    }
  }

  EditarRegistro(item): void {
    const dialogRef = this.dialog.open(CadastroProventosComponent, {
      width: '800px',
      hasBackdrop: true,
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Carregar(null);
    });
  }

  onPaginateChange(event: PageEvent) {
    this.Carregar(event);
  }

  Pesquisar(): void {
    this.Carregar(null);
  }









}
