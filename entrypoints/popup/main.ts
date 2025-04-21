import { communication } from '../../utils/Comunication';
import { DefaultCarEntity } from '../../utils/types';

const apiResponseHandler = (carData: { brand: DefaultCarEntity, model: DefaultCarEntity, fuel: DefaultCarEntity, productionYear: DefaultCarEntity }) => {
  const content = document.querySelector('.content') as HTMLElement;
    const description = document.querySelector('.description') as HTMLElement;
    const list = document.createElement('ul');

    Object.keys(carData).forEach((key) => {
      const item = document.createElement('li');
      item.textContent = `${key}: ${(carData[key as keyof typeof carData]).name} | ${carData[key as keyof typeof carData].value}`;
      list.appendChild(item);
    });

    description.appendChild(list);
    content.classList.add('visible');

    document.querySelector('.loading')?.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.loading')?.classList.add('visible');
  communication.emit(communication.actions.INJECT_CONTENT_SCRIPT);
  
  communication.listen(communication.actions.API_RESPONSE, apiResponseHandler);
});