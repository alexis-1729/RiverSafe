import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'river',
  webDir: 'www',
  server: {
    url: 'http://192.168.123.37',
    cleartext: true
  }
};

export default config;
