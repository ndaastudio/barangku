import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifLupaPwPageRoutingModule } from './verif-lupa-pw-routing.module';

import { VerifLupaPwPage } from './verif-lupa-pw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifLupaPwPageRoutingModule
  ],
  declarations: [VerifLupaPwPage]
})
export class VerifLupaPwPageModule {}
