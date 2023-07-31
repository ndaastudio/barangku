import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class UpdateGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): Promise<boolean> {
    return this.isUpdate();
  }

  async isUpdate(): Promise<boolean> {
    const currentVersion = parseFloat((await App.getInfo()).version);
    const latestVersion = 1.0;
    if (currentVersion < latestVersion) {
      this.router.navigateByUrl('/update');
      return false;
    }
    return true;
  }
}
