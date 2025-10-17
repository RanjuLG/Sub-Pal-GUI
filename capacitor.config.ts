import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.subpal.app',
  appName: 'SubPal',
  webDir: 'dist/Sub-Pal-GUI/browser',
   server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['http://192.168.8.114:8002']
  }
};

export default config;
