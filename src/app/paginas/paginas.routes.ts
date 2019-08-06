import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { InicialComponent } from './inicial/inicial.component';
import { UsuariosComponent } from '../paginas/usuarios/usuarios.component';
import { PrincipalComponent } from '../paginas/principal/principal.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { CorretorasComponent } from './corretoras/corretoras.component';
import { NotasComponent } from './notas/notas.component';
<<<<<<< HEAD
import { GraficoComponent } from './grafico/grafico.component';

=======
import { PgTesteComponent } from './pg-teste/pg-teste.component';
>>>>>>> cfbfd0e94b0c2b765ce4d7634ba91cf676bd323c

export const paginasRoutes: Routes = [
  {
    path: '',
    component: InicialComponent,
    //canActivate: [AuthGuard],
    children: [
      { path: 'principal', component: PrincipalComponent, data: { animation: 'principal' } },
      { path: 'corretoras', component: CorretorasComponent, data: { animation: 'corretoras' } },
      { path: 'notas', component: NotasComponent, data: { animation: 'notas' } },
      { path: 'usuarios', component: UsuariosComponent, data: { animation: 'usuarios' } },
<<<<<<< HEAD
      { path: 'grafico', component: GraficoComponent, data: { animation: 'usuarios' } }

=======
      { path: 'pg-teste', component: PgTesteComponent, data: { animation: 'pg-teste' } }
>>>>>>> cfbfd0e94b0c2b765ce4d7634ba91cf676bd323c
      // { path: '404', component: PaginaNaoEncontradaComponent },
      // { path: '**', redirectTo: '/404' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(paginasRoutes)],
  exports: [RouterModule]
})
export class PaginasRouterModule {}
