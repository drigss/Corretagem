
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cadastro-proventos',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cadastro-proventos.component.html',
  styleUrls: ['./cadastro-proventos.component.scss']
})
export class CadastroProventosComponent implements OnInit {
  hide = true;
  Form: FormGroup;
  dados2: any = {};
  proventos: any = [];

  public tipos: Array<Object> = [{ id: 'Dividendos', descricao: 'Dividendos' }, { id: 'Juros', descricao: 'Juros' }];

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CadastroProventosComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    protected http: HttpClient
  ) {
    this.Form = fb.group({
      nome: [null, Validators.required],
      data_provento: [null, Validators.required],
      tipo: [null, Validators.required],
      papel: [null, Validators.required],
      valor: [null, Validators.required]
    });
    this.CarregarProventos();
  }

  ngOnInit() {
    if (this.dados.id === 0) this.dados2 = {};
    else this.dados2 = { data: moment(this.dados.data_nota.seconds * 1000).format('YYYY-MM-DD'), ...this.dados };
  }

  CarregarProventos(): void {
    this.firestore
      .collection(`proventos`)
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))))
      .subscribe(data => {
        this.proventos = data;
      });
  }

  Salvar(): void {
    if (this.Form.valid) {
      const { nome, data, tipo, papel, valor} = this.dados2;
      if (this.dados.id === 0) {
        this.firestore
          .collection(`proventos`)
          .add({
          nome,
          data_provento: firebase.firestore.Timestamp.fromDate(new Date(moment(data).format('MM/DD/YYYY'))),
          tipo,
          papel,
          valor,
         // created_time: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            swal
              .fire({
                title: 'Atenção!',
                type: 'success',
                text: 'Registro cadastrado com sucesso!'
              })
              .then(result => {
                if (result.value) {
                  this.dialogRef.close();
                }
              });
          })
          .catch(() => {
            swal.fire({
              title: 'Atenção!',
              type: 'warning',
              text: 'Ops... algo de errado aconteceu, tente novamente ou entre em contato com nosso suporte!'
            });
          });
      } else {
        this.firestore
          .doc(`proventos/${this.dados.id}`)
          .update(this.dados2)
          .then(() => {
            swal
              .fire({
                title: 'Atenção!',
                type: 'success',
                text: 'Registro alterado com sucesso!'
              })
              .then(result => {
                if (result.value) {
                  this.dialogRef.close();
                }
              });
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

}
