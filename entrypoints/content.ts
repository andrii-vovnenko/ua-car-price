export default defineContentScript({
  matches: ['https://*.schadeautos.nl/*'],
  registration: 'runtime',
  async main() {
    console.log('Content script loaded', new Date().toISOString());
    const specTable = document.querySelector("div.col12.m-b-lg.specifications > table > tbody");

    if (!specTable) {
      console.log('No spec table found');
      return;
    }

    const rows = specTable.querySelectorAll("tr");
    const carData = new Map<string, string>();
    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      const key = cells[0].textContent;
      const value = cells[1].textContent;
      if (key && value) {
        carData.set(key.replace(':', '').trim().toLowerCase(), value.trim());
      }
    }

    const mark = carData.get('brand');
    const model = carData.get('model');
    const fuel = carData.get('fuel');
    const production = carData.get('erd');
    
    console.log('Sending message to background', {
      mark,
      model,
      fuel,
      production,
    });
    await browser.runtime.sendMessage({
      action: 'car-data',
      params: {
        mark,
        model,
        fuel,
        production,
      }
    }).catch((error) => {
      console.log('Content script error', error);
    });
  },
});
