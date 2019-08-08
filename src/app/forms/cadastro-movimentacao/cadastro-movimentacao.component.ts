import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-movimentacao',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cadastro-movimentacao.component.html',
  styleUrls: ['./cadastro-movimentacao.component.scss']
})
export class CadastroMovimentacaoComponent implements OnInit {
  hide = true;
  Form: FormGroup;
  dados2: any = {};

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CadastroMovimentacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    protected http: HttpClient
  ) {
    this.Form = fb.group({
      nome: [null, Validators.required],
      cnpj: [null, Validators.required],
      banco: [null, Validators.required],
      agencia: [null, Validators.required],
      conta: [null, Validators.required]
    });
  }

  ngOnInit() {
    if (this.dados.id === 0)  this.dados2 = {};
    else  this.dados2 = this.dados;
  }

  Salvar(): void {
    if (this.Form.valid) {
      if (this.dados.id === 0) {
        this.firestore
          .collection(`movimentacao`)
          .add(this.dados2)
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
          .doc(`movimentacao/${this.dados.id}`)
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
