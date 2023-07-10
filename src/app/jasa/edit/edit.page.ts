import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataJasa: any = [];
  nama_jasa: any;
  kategori: any;
  kategori_lainnya: any;
  jumlah_jasa: any;
  letak_jasa: any;
  keterangan: any;
  jadwal_rencana: any;
  jadwal_notifikasi: any;
  reminder: any;

  constructor(private databaseService: DatabaseService,
    private dataSharingService: DataSharingService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.databaseService.getJasaById(this.id).then((data) => {
      this.dataJasa = data;
      this.nama_jasa = data.nama_jasa;
      this.kategori = data.kategori !== 'Opsi Lainnya' ? data.kategori : '';
      this.kategori_lainnya = data.kategori;
      this.jumlah_jasa = data.jumlah_jasa;
      this.letak_jasa = data.letak_jasa;
      this.keterangan = data.keterangan;
      this.jadwal_rencana = data.jadwal_rencana;
      this.jadwal_notifikasi = data.jadwal_notifikasi;
    });
  }

  saveToDatabase() {
    this.dataJasa.nama_jasa = this.nama_jasa;
    this.dataJasa.kategori = this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori;
    this.dataJasa.jumlah_jasa = this.jumlah_jasa;
    this.dataJasa.letak_jasa = this.letak_jasa;
    this.dataJasa.keterangan = this.keterangan;
    this.dataJasa.jadwal_rencana = this.jadwal_rencana;
    this.dataJasa.jadwal_notifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
    this.databaseService.updateJasa(this.dataJasa).then(() => {
      this.dataSharingService.refresh();
      this.router.navigateByUrl(`/jasa/show/${this.id}`);
    });
  }

}
