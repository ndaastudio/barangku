import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PindahPerangkatPage } from './pindah-perangkat.page';

const routes: Routes = [
  {
    path: '',
    component: PindahPerangkatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PindahPerangkatPageRoutingModule {}
