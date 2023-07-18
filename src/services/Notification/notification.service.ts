import { Injectable } from "@angular/core";
import { LocalNotifications } from "@capacitor/local-notifications";

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    async scheduleNotification(title: string, body: string, id: number, time: Date) {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: title,
                    body: body,
                    id: id,
                    schedule: { at: time },
                }
            ]
        });
    }

    async cancelNotification(id: number) {
        await LocalNotifications.cancel({ notifications: [{ id: id }] });
    }
}