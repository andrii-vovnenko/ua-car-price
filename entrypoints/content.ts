import { communication } from '../utils/Comunication';

export default defineContentScript({
  matches: ['https://*.schadeautos.nl/*'],
  registration: 'runtime',
  async main() {
    const specTable = document.querySelector("div.col12.m-b-lg.specifications > table > tbody");

    if (!specTable) {
      console.log('No spec table found');
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

    communication.emit(communication.actions.RAW_CAR_DATA, {
      brand,
      model,
      fuel,
      productionYear: production,
    });
  },
});
