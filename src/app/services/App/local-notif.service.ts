import { Injectable } from '@angular/core';
import { LocalNotifications } from "@capacitor/local-notifications";
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocalNotifService {

  constructor(private platform: Platform) {
    this.init();
  }

  async init() {
      if ((await LocalNotifications.checkPermissions()).display !== "granted") {
        await LocalNotifications.requestPermissions();
        await this.init();
      }
      const list = await LocalNotifications.listChannels();
      if (list.channels.length < 2) {
        await LocalNotifications.createChannel({
          id: '1',
          name: 'Barang',
          importance: 4,
        });
      }
  }

  async create(channel: string, title: string, body: string, id: number, time: Date, url: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: id,
          schedule: { at: time },
          channelId: channel,
          extra: {
            url: url
          }
        }
      ]
    });
  }

  async delete(id: number) {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  }

  async deleteAll() {
    const pending = await LocalNotifications.getPending();
    pending.notifications.forEach((notification) => {
      this.delete(notification.id);
    });
  }
}
