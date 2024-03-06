import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPageRoutingModule } from './show-routing.module';

import { ShowPage } from './show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ShowPage]
})
export class ShowPageModule {}
