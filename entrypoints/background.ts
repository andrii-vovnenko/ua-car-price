// entrypoints/background.ts
import { browser } from 'wxt/browser';
const shadeAutosUrl = 'www.schadeautos.nl';

const hostToScriptMap: Record<string, string> = {
  [shadeAutosUrl]: './content-scripts/content.js',
};

export default defineBackground(async () => {
  browser.runtime.onMessage.addListener(async (message) => {
    console.log('Message', message);
    if (message.action === 'injectContentScript') {
      console.log('Injecting content script ', new Date().toISOString());
      browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        console.log('Tabs', tabs);
        if (tabs.length > 0 && tabs[0].id) {
          const tabId = tabs[0].id;
          const tabUrl = tabs[0].url;
          console.log('Tab ID', tabId);
          console.log('Tab URL', tabUrl);

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
            // show pwd

            // process is not defined in the browser environment
            // console.log('PWD', process.cwd());

            // show folder content
            // console.log('Folder content', fs.readdirSync(process.cwd()));
            // Execute the content script in the current tab
            await browser.scripting.executeScript({
              target: { tabId: tabId },
              files: [hostToScriptMap[url.host]],
            });
          } catch (error) {
            console.error("Failed to register or execute content script:", error);
          }
        }
      });
    } else if (message.action === 'car-data') {
      console.log('Car data', message.params);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      browser.runtime.sendMessage({ action: 'api-response', params: message.params });
    }
  });
});