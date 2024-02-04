import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalyticPage } from './analytic.page';

const routes: Routes = [
  {
    path: '',
    component: AnalyticPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticPageRoutingModule {}
