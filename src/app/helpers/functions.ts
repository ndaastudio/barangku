import { AlertController, LoadingController } from "@ionic/angular";

export function formatDate(date: string) {
    try {
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const year = date.substring(0, 4);
        const month = monthNames[parseInt(date.substring(5, 7)) - 1];
        const day = date.substring(8, 10);
        return `${day} ${month} ${year}`;
    } catch (error) {
        return date;
    }
}

export async function showAlert(alertCtrl: AlertController, header: string, message: string) {
    const alert = await alertCtrl.create({
        header: header,
        message: message,
        buttons: [{
            text: 'OK',
        }]
    });
    await alert.present();
}

export async function showLoading(loadingCtrl: LoadingController, message: string) {
    const loading = await loadingCtrl.create({
        message: message,
    });
    await loading.present();
}