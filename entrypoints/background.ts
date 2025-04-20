// entrypoints/background.ts
import { browser } from 'wxt/browser';
const shadeAutosUrl = 'www.schadeautos.nl';

const hostToScriptMap: Record<string, string> = {
  [shadeAutosUrl]: './content-scripts/content.js',
};

export default defineBackground(async () => {
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'injectContentScript') {
      browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          const tabId = tabs[0].id;
          const tabUrl = tabs[0].url;

          if (!tabUrl) {
            console.error('Tab URL is undefined');
            return;
          }

          const url = new URL(tabUrl);

          if (!hostToScriptMap[url.host]) {
            console.error('No script found for URL', url.host);
            return;
          }

          try {
            await browser.scripting.executeScript({
              target: { tabId: tabId },
              files: [hostToScriptMap[url.host]],
            });
          } catch (error) {
            console.error("Failed to register or execute content script:", error);
          }
        }
      });
    } else if (message.action === 'raw-carData') {
      const carData = new ShadeautosParser({
        rawCarData: {
          brand: message.params.brand,
          model: message.params.model,
          fuel: message.params.fuel,
          productionYear: message.params.production
        },
      });

      console.log('Car data', carData);

      browser.runtime.sendMessage({ action: 'api-response', params: {
        brand: carData.carBrand,
        model: carData.carModel,
        fuel: carData.carFuel,
        productionYear: carData.carProductionYear,
      } });
    }
  });
});