import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowBarangPageRoutingModule } from './show-barang-routing.module';

import { ShowBarangPage } from './show-barang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowBarangPageRoutingModule
  ],
  declarations: [ShowBarangPage]
})
export class ShowBarangPageModule {}
