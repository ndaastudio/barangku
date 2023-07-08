import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahJasaPageRoutingModule } from './tambah-jasa-routing.module';

import { TambahJasaPage } from './tambah-jasa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahJasaPageRoutingModule
  ],
  declarations: [TambahJasaPage]
})
export class TambahJasaPageModule {}
