import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'edit-profil',
    loadChildren: () => import('./pages/profil/edit/edit.module').then(m => m.EditProfilPageModule)
  },
  {
    path: 'barang/create',
    loadChildren: () => import('./pages/barang/create/create.module').then(m => m.TambahBarangPageModule)
  },
  {
    path: 'jasa/create',
    loadChildren: () => import('./pages/jasa/create/create.module').then(m => m.TambahJasaPageModule)
  },
  {
    path: 'barang/show/:id',
    loadChildren: () => import('./pages/barang/show/show.module').then(m => m.ShowBarangPageModule)
  },
  {
    path: 'jasa/show/:id',
    loadChildren: () => import('./pages/jasa/show/show.module').then(m => m.ShowJasaPageModule)
  },
  {
    path: 'verif-lupa-pw',
    loadChildren: () => import('./pages/auth/verif-lupa-pw/verif-lupa-pw.module').then(m => m.VerifLupaPwPageModule)
  },
  {
    path: 'barang/edit/:id',
    loadChildren: () => import('./pages/barang/edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: 'jasa/edit/:id',
    loadChildren: () => import('./pages/jasa/edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/update/update.module').then(m => m.UpdatePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
