import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.photojournal.app",
  appName: "Photo Journal",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"],
    },
    Filesystem: {
      permissions: ["storage"],
    },
  },
};

export default config;
