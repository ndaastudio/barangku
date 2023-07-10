import { Component } from '@angular/core';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private database: DatabaseService) { }

  ngOnInit() {
    this.database.init();
  }
}
