import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PindahPerangkatPageRoutingModule } from './pindah-perangkat-routing.module';

import { PindahPerangkatPage } from './pindah-perangkat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PindahPerangkatPageRoutingModule
  ],
  declarations: [PindahPerangkatPage]
})
export class PindahPerangkatPageModule {}
