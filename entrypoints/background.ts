// entrypoints/background.ts
import { browser } from 'wxt/browser';
import { communication } from '@/utils/Comunication';
import { AutoRiaAvaragePriceApi } from '@/utils/CarAvaragePrice';
import { ShadeautosParser } from '@/utils/ShadeautosParser';
import { CalculateCarFees } from '@/utils/CarFees';
import { Exchanger } from '@/utils/Exchanger';
const shadeAutosUrl = 'www.schadeautos.nl';

const RIA_API_KEY = import.meta.env.WXT_RIA_API_KEY;
const RIA_USER_ID = import.meta.env.WXT_RIA_USER_ID;

const hostToScriptMap: Record<string, string> = {
  [shadeAutosUrl]: './content-scripts/content.js',
};

const exchanger = new Exchanger();

export default defineBackground(async () => {
  if (RIA_API_KEY && RIA_USER_ID) {
    await browser.storage.local.set({
      userId: RIA_USER_ID,
      apiKey: RIA_API_KEY,
    });
  }
  // Add authentication check helper
  async function checkAuth(): Promise<boolean> {
    const auth = await browser.storage.local.get(['userId', 'apiKey']);
    return !!(auth.userId && auth.apiKey);
  }
  let avaragePriceApi: AutoRiaAvaragePriceApi | null = null;
  if (await checkAuth()) {
    avaragePriceApi = new AutoRiaAvaragePriceApi(
      (await browser.storage.local.get('userId'))['userId'],
      (await browser.storage.local.get('apiKey'))['apiKey'],
      exchanger,
    );
  }

  communication.listen(communication.actions.SAVE_CREDENTIALS, async (credentials) => {
    await browser.storage.local.set(credentials);
    avaragePriceApi = new AutoRiaAvaragePriceApi(
      credentials.userId,
      credentials.apiKey,
      exchanger,
    );
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

      if (!avaragePriceApi) {
        throw new Error('No API key found');
      }

      const carFees = new CalculateCarFees(carData);

      const [avaragePrice, fee] = await Promise.all([
        avaragePriceApi.getCarAvaragePrice({
          carBrand: carData.carBrand.value,
          carModel: carData.carModel.value,
          carFuel: carData.carFuel.value,
          carProductionYear: carData.carProductionYear.value,
          carEngineCapacity: carData.carEngineCapacity?.value || 0,
        }).catch((error) => {
          console.error('Error getting avarage price', error);
          return 0;
        }),
        carFees.calculateCarFees().catch((error) => {
          console.error('Error calculating car fees', error);
          return { customsClearanceCosts: 0, fullPrice: 0 };
        }),
      ]);
      
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