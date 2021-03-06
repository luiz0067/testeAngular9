import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./layout/login/login.module').then(m => m.LoginModule) },
  { path: 'grupo', loadChildren: () => import('./layout/grupo/grupo.module').then(m => m.GrupoModule) },
  { path: 'produto', loadChildren: () => import('./layout/produto/produto.module').then(m => m.ProdutoModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
