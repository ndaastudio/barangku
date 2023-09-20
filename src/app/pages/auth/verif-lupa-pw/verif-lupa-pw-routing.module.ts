import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifLupaPwPage } from './verif-lupa-pw.page';

const routes: Routes = [
  {
    path: '',
    component: VerifLupaPwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifLupaPwPageRoutingModule {}
