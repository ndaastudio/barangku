import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.page.html',
  styleUrls: ['./edit-profil.page.scss'],
})
export class EditProfilPage implements OnInit {
  password: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  getPictureFromGallery() {
    console.log('getPictureFromGallery');
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
