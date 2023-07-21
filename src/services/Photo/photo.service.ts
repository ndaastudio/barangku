import { Injectable } from "@angular/core";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Platform } from "@ionic/angular";

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
            if (!cameraPermission.camera || !cameraPermission.photos) {
                await Camera.requestPermissions();
            }
        }
    }

    public async addNewToGallery() {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
            quality: 100
        });
        return capturedPhoto;
    }

    public async savePicture(cameraPhoto: Photo, fileName: string) {
        const base64Data = await this.readAsBase64(cameraPhoto);
        await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data
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

    public async loadPicture(fileName: string) {
        const photo = await Filesystem.readFile({
            path: fileName,
            directory: Directory.Data
        });
        return {
            fileName: fileName,
            webviewPath: `data:image/jpeg;base64,${photo.data}`
        };
    }

    public async deletePicture(fileName: string) {
        await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Data
        });
    }
}
