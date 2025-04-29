import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    host_permissions: [
      "https://auto.ria.com/*" // <-- Grant permission to this domain
    ],
  }
});
