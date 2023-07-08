import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahBarangPageRoutingModule } from './tambah-barang-routing.module';

import { TambahBarangPage } from './tambah-barang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahBarangPageRoutingModule
  ],
  declarations: [TambahBarangPage]
})
export class TambahBarangPageModule {}
