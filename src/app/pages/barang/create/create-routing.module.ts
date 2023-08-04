import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahBarangPage } from './create.page';

const routes: Routes = [
  {
    path: '',
    component: TambahBarangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahBarangPageRoutingModule { }
