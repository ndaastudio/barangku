import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  // },
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
    loadChildren: () => import('./edit-profil/edit-profil.module').then(m => m.EditProfilPageModule)
  },
  {
    path: 'barang/create',
    loadChildren: () => import('./barang/create/create.module').then(m => m.TambahBarangPageModule)
  },
  {
    path: 'tambah-jasa',
    loadChildren: () => import('./tambah-jasa/tambah-jasa.module').then(m => m.TambahJasaPageModule)
  },
  {
    path: 'barang/show/:id',
    loadChildren: () => import('./barang/show/show.module').then(m => m.ShowBarangPageModule)
  },
  {
    path: 'show-jasa',
    loadChildren: () => import('./show-jasa/show-jasa.module').then(m => m.ShowJasaPageModule)
  },
  {
    path: 'verif-lupa-pw',
    loadChildren: () => import('./auth/verif-lupa-pw/verif-lupa-pw.module').then(m => m.VerifLupaPwPageModule)
  },
  {
    path: 'barang/edit/:id',
    loadChildren: () => import('./barang/edit/edit.module').then(m => m.EditPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
