import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Barangku',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      iconColor: "#30a2ff",
      sound: "res://raw/beep.wav",
      smallIcon: "res://drawable/ic_small_notification_icon.png",
    },
  },
};

export default config;
