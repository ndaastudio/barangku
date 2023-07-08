import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowJasaPage } from './show-jasa.page';

const routes: Routes = [
  {
    path: '',
    component: ShowJasaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowJasaPageRoutingModule {}
