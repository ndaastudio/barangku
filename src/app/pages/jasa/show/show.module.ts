import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowJasaPageRoutingModule } from './show-routing.module';

import { ShowJasaPage } from './show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowJasaPageRoutingModule
  ],
  declarations: [ShowJasaPage]
})
export class ShowJasaPageModule { }
