import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CadastroProventosComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    protected http: HttpClient
  ) {
    this.Form = fb.group({
      nome: [null, Validators.required],
      cnpj: [null, Validators.required],
      tipo: [null, Validators.required],
      papel: [null, Validators.required],
      valor: [null, Validators.required]
    });
  }

  ngOnInit() {
    if (this.dados.id === 0) this.dados2 = {};
    else this.dados2 = this.dados;
  }

  Salvar(): void {
    if (this.Form.valid) {
      if (this.dados.id === 0) {
        this.firestore
          .collection(`proventos`)
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
