import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowBarangPage } from './show-barang.page';

const routes: Routes = [
  {
    path: '',
    component: ShowBarangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowBarangPageRoutingModule {}
