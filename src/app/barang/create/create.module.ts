import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahBarangPageRoutingModule } from './create-routing.module';

import { TambahBarangPage } from './create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahBarangPageRoutingModule
  ],
  declarations: [TambahBarangPage]
})
export class TambahBarangPageModule { }
