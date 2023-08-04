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

export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
        return str;
    } else {
        return `${str.substring(0, maxLength)}...`;
    }
}

export function getCurrentDateTime(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}