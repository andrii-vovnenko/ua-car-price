// entrypoints/background.ts
import { browser } from 'wxt/browser';
import { communication } from '@/utils/Comunication';
import { AutoRiaAvaragePriceApi } from '@/utils/CarAvaragePrice';
import { ShadeautosParser } from '@/utils/ShadeautosParser';
import { CalculateCarFees } from '@/utils/CarFees';
const shadeAutosUrl = 'www.schadeautos.nl';

const hostToScriptMap: Record<string, string> = {
  [shadeAutosUrl]: './content-scripts/content.js',
};

export default defineBackground(async () => {
  // Add authentication check helper
  async function checkAuth(): Promise<boolean> {
    const auth = await browser.storage.local.get(['userId', 'apiKey']);
    return !!(auth.userId && auth.apiKey);
  }

  communication.listen(communication.actions.SAVE_CREDENTIALS, async (credentials) => {
    await browser.storage.local.set(credentials);
  });

  communication.listen(communication.actions.CLOSE_TAB, async () => {
    browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        const tabId = tabs[0].id;
        await browser.tabs.remove(tabId);
      }
    });
  });
  
  communication.listen(communication.actions.INJECT_CONTENT_SCRIPT, async () => {
    // Check authentication before proceeding
    if (!await checkAuth()) {
      // If not authenticated, open options page
      browser.runtime.openOptionsPage();
      return;
    }

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

      const avaragePriceApi = new AutoRiaAvaragePriceApi(
        (await browser.storage.local.get('userId'))['userId'],
        (await browser.storage.local.get('apiKey'))['apiKey'],
      );

      const avaragePrice = await avaragePriceApi.getCarAvaragePrice({
        carBrand: carData.carBrand.value,
        carModel: carData.carModel.value,
        carFuel: carData.carFuel.value,
        carProductionYear: carData.carProductionYear.value,
        carEngineCapacity: carData.carEngineCapacity?.value || 0,
      });
      const carFees = new CalculateCarFees(carData);
      const fee = await carFees.calculateCarFees();
      
      communication.emit(communication.actions.API_RESPONSE, {
        brand: carData.carBrand,
        model: carData.carModel,
        fuel: carData.carFuel,
        productionYear: carData.carProductionYear,
        engineCapacity: carData.carEngineCapacity,
        price: carData.carPrice,
        customsCosts: { name: 'Customs Costs', value: fee.customsClearanceCosts },
        fullPrice: { name: 'Full Price', value: fee.fullPrice },
        avaragePrice: { name: 'Avarage Price', value: avaragePrice },
      });
    } catch (error: any) {
      communication.emit(communication.actions.ERROR, error.message as string);
    }
  });
});