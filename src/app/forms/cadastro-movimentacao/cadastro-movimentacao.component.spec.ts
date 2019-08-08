import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMovimentacaoComponent } from './cadastro-movimentacao.component';

describe('CadastroMovimentacaoComponent', () => {
  let component: CadastroMovimentacaoComponent;
  let fixture: ComponentFixture<CadastroMovimentacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroMovimentacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroMovimentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
