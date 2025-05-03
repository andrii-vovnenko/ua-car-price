import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    host_permissions: [
      "https://auto.ria.com/*", // <-- Grant permission to this domain
      "https://developers.ria.com/*", // <-- Grant permission to this domain
      "https://www.schadeautos.nl/*", // <-- Grant permission to this domain
    ],
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true
    },
    permissions: [
      'storage'
    ]
  },
});
