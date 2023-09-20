import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UpdateGuard } from './guards/update.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'verif-lupa-pw',
    loadChildren: () => import('./pages/auth/verif-lupa-pw/verif-lupa-pw.module').then(m => m.VerifLupaPwPageModule)
  },
  {
    path: 'barang',
    loadChildren: () => import('./pages/barang/index/index.module').then(m => m.IndexPageModule),
    canLoad: [UpdateGuard]
  },
  {
    path: 'barang/create',
    loadChildren: () => import('./pages/barang/create/create.module').then(m => m.CreatePageModule)
  },
  {
    path: 'barang/show/:id',
    loadChildren: () => import('./pages/barang/show/show.module').then(m => m.ShowPageModule)
  },
  {
    path: 'barang/edit/:id',
    loadChildren: () => import('./pages/barang/edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/index/index.module').then(m => m.IndexPageModule)
  },
  {
    path: 'profil/edit',
    loadChildren: () => import('./pages/profil/edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/update/update.module').then(m => m.UpdatePageModule)
  },
  {
    path: 'pindah-perangkat',
    loadChildren: () => import('./pages/pindah-perangkat/pindah-perangkat.module').then(m => m.PindahPerangkatPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
