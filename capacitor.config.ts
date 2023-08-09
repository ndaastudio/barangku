import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.barangku.app',
  appName: 'Barangku',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      iconColor: "#30a2ff",
      sound: "beep.wav",
      smallIcon: "ic_small_notification_icon.png",
    },
  },
};

export default config;
