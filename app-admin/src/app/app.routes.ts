import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio/inicio.page';
import { UsuariosPage } from './pages/usuarios/usuarios.page';
import { TrabajosPage } from './pages/trabajos/trabajos.page';
import { FichajesPage } from './pages/fichajes/fichajes.page';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioPage },
  { path: 'usuarios', component: UsuariosPage },
  { path: 'trabajos', component: TrabajosPage },
  { path: 'fichajes', component: FichajesPage },
  { path: 'trabajos', loadComponent: () => import('./pages/trabajos/trabajos.page').then(m => m.TrabajosPage) },
  { path: 'fichajes', loadComponent: () => import('./pages/fichajes/fichajes.page').then(m => m.FichajesPage)
}
];
