import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateGuard } from '../../guards/update.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'barang',
        loadChildren: () => import('../barang/index/index.module').then(m => m.IndexPageModule),
        canLoad: [UpdateGuard]
      },
      {
        path: 'analytic',
        loadChildren: () => import('../analytic/analytic.module').then(m => m.AnalyticPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/barang',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
