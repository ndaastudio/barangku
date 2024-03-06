import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalFilterLetakComponent } from 'src/app/components/modal-filter-letak/modal-filter-letak.component';



@NgModule({
  declarations: [ModalFilterLetakComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [ModalFilterLetakComponent]
})
export class ComponentsModule { }
