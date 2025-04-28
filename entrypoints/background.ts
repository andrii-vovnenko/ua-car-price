// entrypoints/background.ts
import { browser } from 'wxt/browser';
import { communication } from '../utils/Comunication';
const shadeAutosUrl = 'www.schadeautos.nl';

const hostToScriptMap: Record<string, string> = {
  [shadeAutosUrl]: './content-scripts/content.js',
};

export default defineBackground(async () => {
  communication.listen(communication.actions.INJECT_CONTENT_SCRIPT, async () => {
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
  });

  communication.listen(communication.actions.RAW_CAR_DATA, async (params) => {
    try {
      const carData = new ShadeautosParser({
        rawCarData: {
          brand: params.brand,
          model: params.model,
          fuel: params.fuel,
          productionYear: params.productionYear,
          engineCapacity: params.engineCapacity,
          price: params.price,
        },
      });
      communication.emit(communication.actions.API_RESPONSE, {
        brand: carData.carBrand,
        model: carData.carModel,
        fuel: carData.carFuel,
        productionYear: carData.carProductionYear,
        engineCapacity: carData.carEngineCapacity,
        price: carData.carPrice
      });
    } catch (error: any) {
      communication.emit(communication.actions.ERROR, error.message as string);
    }
  });
});