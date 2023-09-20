import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {

  private refreshData = new Subject<void>();
  refreshedData = this.refreshData.asObservable();

  refresh() {
    this.refreshData.next();
  }
}
