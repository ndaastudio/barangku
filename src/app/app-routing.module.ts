import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'edit-profil',
    loadChildren: () => import('./edit-profil/edit-profil.module').then( m => m.EditProfilPageModule)
  },
  {
    path: 'tambah-barang',
    loadChildren: () => import('./tambah-barang/tambah-barang.module').then( m => m.TambahBarangPageModule)
  },
  {
    path: 'tambah-jasa',
    loadChildren: () => import('./tambah-jasa/tambah-jasa.module').then( m => m.TambahJasaPageModule)
  },
  {
    path: 'show-barang',
    loadChildren: () => import('./show-barang/show-barang.module').then( m => m.ShowBarangPageModule)
  },
  {
    path: 'show-jasa',
    loadChildren: () => import('./show-jasa/show-jasa.module').then( m => m.ShowJasaPageModule)
  },
  {
    path: 'verif-lupa-pw',
    loadChildren: () => import('./auth/verif-lupa-pw/verif-lupa-pw.module').then( m => m.VerifLupaPwPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
