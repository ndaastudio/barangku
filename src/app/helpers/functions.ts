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

export async function showAlert(alertCtrl: AlertController, header: string, message: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
        const alert = await alertCtrl.create({
            header: header,
            message: message,
            buttons: [{
                text: 'OK',
                handler: () => {
                    resolve();
                }
            }]
        });
        await alert.present();
    });
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

export function formatTime(time: string): string {
    try {
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } catch (error) {
        return time;
    }
}