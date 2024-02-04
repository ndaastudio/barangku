import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalyticPageRoutingModule } from './analytic-routing.module';

import { AnalyticPage } from './analytic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalyticPageRoutingModule
  ],
  declarations: [AnalyticPage]
})
export class AnalyticPageModule {}
