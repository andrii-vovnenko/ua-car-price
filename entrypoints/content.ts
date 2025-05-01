import { communication } from '../utils/Comunication';

export default defineContentScript({
  matches: ['https://*.schadeautos.nl/*'],
  registration: 'runtime',
  async main(ctx) {
    const url = new URL(window.location.href);
    const [lang, ...path] = url.pathname.split('/').filter(Boolean);
    if (lang !== 'en') {
      // Add a small delay before redirecting to ensure any pending operations complete
      communication.emit(communication.actions.CLOSE);
      window.location.href = `/en/${path.join('/')}`;
    }
    
    const specTable = document.querySelector("div.col12.m-b-lg.specifications > table > tbody");

    if (!specTable) {
      communication.emit(communication.actions.ERROR, 'No spec table found');
      return;
    }

    const rows = specTable.querySelectorAll("tr");
    const rawCarData = new Map<string, string>();

    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      const key = cells[0].textContent;
      const value = cells[1].textContent;
      if (key && value) {
        rawCarData.set(key.replace(':', '').trim().toLowerCase(), value.trim());
      }
    }

    const fuel = rawCarData.get('fuel') || '';
    const production = rawCarData.get('erd') || '';
    const brand = rawCarData.get('brand') || '';
    const model = rawCarData.get('model') || '';
    const engineCapacity = rawCarData.get('engine capacity') || '';
    const price = rawCarData.get('sales price nl') || rawCarData.get('net export price') || '';
    
    communication.emit(communication.actions.RAW_CAR_DATA, {
      brand,
      model,
      fuel,
      productionYear: production,
      engineCapacity: engineCapacity,
      price,
    });
  },
});
