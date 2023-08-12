import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Platform } from "@ionic/angular";

const IMAGE_DIR = '.Barangku/Images';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private platform: Platform) {
    this.initPermissions();
  }

  async initPermissions() {
    if (this.platform.is('android')) {
      const cameraPermission = await Camera.checkPermissions();
      const storagePermission = await Filesystem.checkPermissions();
      if (!cameraPermission.camera || !cameraPermission.photos) {
        await Camera.requestPermissions();
        await this.initPermissions();
      }
      if (!storagePermission.publicStorage) {
        await Filesystem.requestPermissions();
        await this.initPermissions();
      }
      await this.initDirectory();
    }
  }

  async initDirectory() {
    Filesystem.stat({
      path: IMAGE_DIR,
      directory: Directory.Documents
    }).catch(async () => {
      await Filesystem.mkdir({
        path: IMAGE_DIR,
        directory: Directory.Documents,
        recursive: true
      });
    });
  }

  public async capture() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 50
    });
    return capturedPhoto;
  }

  public async save(cameraPhoto: Photo, fileName: string) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Documents
    });
    return fileName;
  }

  private async readAsBase64(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  private async convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  public async load(fileName: string) {
    const photo = await Filesystem.readFile({
      path: `${IMAGE_DIR}/${fileName}`,
      directory: Directory.Documents
    });
    return {
      fileName: fileName,
      webviewPath: `data:image/jpeg;base64,${photo.data}`
    };
  }

  public async delete(fileName: string) {
    await Filesystem.deleteFile({
      path: `${IMAGE_DIR}/${fileName}`,
      directory: Directory.Documents
    });
  }
}
