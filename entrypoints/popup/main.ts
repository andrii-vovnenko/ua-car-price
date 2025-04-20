// entrypoints/popup.ts
import { browser } from 'wxt/browser';

document.addEventListener('DOMContentLoaded', async () => {
  // Send a message to the background script
  console.log('Popup script loaded');
  document.querySelector('.loading')?.classList.add('visible');
  browser.runtime.sendMessage({ action: 'injectContentScript' });
  browser.runtime.onMessage.addListener((message) => {
    console.log('client message', message);
    if (message.action === 'api-response') {
      console.log('API response', message.params);
      const content = document.querySelector('.content') as HTMLElement;
      const brandLogo = document.querySelector('.brand-logo') as HTMLImageElement;
      const description = document.querySelector('.description') as HTMLElement;
      const list = document.createElement('ul');

      Object.keys(message.params).forEach((key) => {
        const item = document.createElement('li');
        item.textContent = `${key}: ${message.params[key].name} | ${message.params[key].value}`;
        list.appendChild(item);
      });

      description.appendChild(list);
      content.classList.add('visible');

      document.querySelector('.loading')?.classList.remove('visible');
    }
  });
});