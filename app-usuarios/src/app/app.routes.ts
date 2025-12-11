import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio/inicio.page';
import { RegistrarPage } from './pages/registrar/registrar.page';
import { ConsultaPage } from './pages/consulta/consulta.page';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioPage },
  { path: 'registrar', component: RegistrarPage },
  { path: 'consulta', component: ConsultaPage },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  }
];
