const config = {
  appId: "com.bhakti.devotional",
  appName: "Bhakti",
  webDir: "public",
  server: process.env.CAPACITOR_SERVER_URL
    ? {
        url: process.env.CAPACITOR_SERVER_URL,
        cleartext: process.env.CAPACITOR_SERVER_URL.startsWith("http://"),
      }
    : undefined,
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

module.exports = config;
