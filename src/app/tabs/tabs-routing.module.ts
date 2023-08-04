import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'barang',
        loadChildren: () => import('../pages/barang/index/index.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'jasa',
        loadChildren: () => import('../pages/jasa/index/index.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'profil',
        loadChildren: () => import('../pages/profil/index/index.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/barang',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/barang',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
