import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroProventosComponent } from './cadastro-proventos.component';

describe('CadastroProventosComponent', () => {
  let component: CadastroProventosComponent;
  let fixture: ComponentFixture<CadastroProventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroProventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroProventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
