import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NotasOperacoes } from 'src/app/models/notas_operacoes';
import * as firebase from 'firebase';

@Component({
  selector: 'app-operacoes-nota',
  templateUrl: './operacoes-nota.component.html',
  styleUrls: ['./operacoes-nota.component.scss']
})
export class OperacoesNotaComponent implements OnInit {
  hide = true;
  Form: FormGroup;
  dados2: any = {};
  Carregando: Boolean = false;

  public operacoes: Array<Object> = [{ id: 'C', descricao: 'Compra' }, { id: 'V', descricao: 'Venda' }];
  public papeis: Array<Object> = [{ descricao: 'Ação' }, { descricao: 'ETF' }, { descricao: 'Fundo Imobiliário' }, { descricao: 'Opção' }, { descricao: 'Mini-Índice' }, { descricao: 'Mini-Dólar' }];
  public displayedColumns = [
    'operacao',
    'ticker',
    'papel',
    'quantidade',
    'preco_unitario',
    'preco_total',
    'liquido',
    'registro',
    'emolumento',
    'ir',
    'excluir'
  ];
  public dataSource = [];

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OperacoesNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    protected http: HttpClient
  ) {
    this.Form = fb.group({
      operacao: [null, Validators.required],
      ticker: [null, Validators.required],
      papel: [null, Validators.required],
      quantidade: [null, Validators.required],
      preco_unitario: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.CarregarOperacoes();
  }

  Salvar(): void {
    if (this.Form.valid) {
      if (this.dados2.id === undefined) {
        this.firestore
          .collection(`notas/${this.dados.id}/operacoes`)
          .add({
            preco_total: (this.dados2.quantidade * this.dados2.preco_unitario).toFixed(2),
            //created_time: firebase.firestore.FieldValue.serverTimestamp(),
            ...this.dados2
          })
          .then(() => {
            this.ResetForm();
            this.CarregarOperacoes();
          })
          .catch(() => {
            swal.fire({
              title: 'Atenção!',
              type: 'warning',
              text: 'Ops... algo de errado aconteceu, tente novamente ou entre em contato com nosso suporte!'
            });
          });
      }
    }
  }

  CarregarOperacoes(): void {
    this.Carregando = true;
    this.firestore
      .collection(`notas/${this.dados.id}/operacoes`)
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ id: c.payload.doc.id, ...(c.payload.doc.data() as NotasOperacoes) }))))
      .subscribe(data => {
        if (data.length > 0) {
          if (data.length > 1) {
            let auxTotal = 0;
            data.forEach(obj => {
              auxTotal += obj.quantidade * obj.preco_unitario;
            });
            data.forEach(obj => {
              const liq = ((this.dados.liquidacao / auxTotal) * obj.preco_total).toFixed(4);
              const reg = ((this.dados.registro / auxTotal) * obj.preco_total).toFixed(4);
              const emol = ((this.dados.emolumento / auxTotal) * obj.preco_total).toFixed(4);
              const irrf = ((this.dados.ir / auxTotal) * obj.preco_total).toFixed(4);
              this.firestore
                .doc(`notas/${this.dados.id}/operacoes/${obj.id}`)
                .update({ liquido: liq, registro: reg, emolumento: emol, ir: irrf });
            });
            //Registro, emolumento, ir
            // data.forEach(obj => {
            //   const reg = ((this.dados.registro / auxTotal) * obj.preco_total).toFixed(4);
            //   this.firestore.doc(`notas/${obj.id}`).update({ registro: reg });
            // });
            // data.forEach(obj => {
            //   const emol = ((this.dados.emolumento / auxTotal) * obj.preco_total).toFixed(4);
            //   this.firestore.doc(`notas/${obj.id}`).update({ emolumento: emol });
            // });
            // data.forEach(obj => {
            //   const irrf = ((this.dados.ir / auxTotal) * obj.preco_total).toFixed(4);
            //   this.firestore.doc(`notas/${obj.id}`).update({ ir: irrf });
            // });
          } else {
            this.firestore.doc(`notas/${this.dados.id}/operacoes/${data[0].id}`).update({
              liquido: this.dados.liquidacao,
              registro: this.dados.registro,
              emolumento: this.dados.emolumento,
              ir: this.dados.ir
            });
            //teste
            // this.firestore.doc(`notas/${data[0].id}`).update({ registro: this.dados.registro });
            // this.firestore.doc(`notas/${data[0].id}`).update({ emolumento: this.dados.emolumento });
            // this.firestore.doc(`notas/${data[0].id}`).update({ ir: this.dados.ir });
          }
          this.dataSource = data;
        } else {
          this.dataSource = [];
        }
        this.Carregando = false;
      });
  }

  ResetForm(): void {
    this.Form.reset();
    Object.keys(this.Form.controls).forEach(key => {
      this.Form.controls[key].setErrors(null);
    });
  }

  Excluir(item): void {
    this.firestore
      .doc(`notas/${this.dados.id}/operacoes/` + item.id)
      .delete()
      .then(() => this.CarregarOperacoes());
  }
}
