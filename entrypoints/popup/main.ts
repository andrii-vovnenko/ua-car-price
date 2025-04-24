import { communication } from '../../utils/Comunication';
import { DefaultCarEntity } from '../../utils/types';

const apiResponseHandler = (carData: { brand: DefaultCarEntity, model: DefaultCarEntity, fuel: DefaultCarEntity, productionYear: DefaultCarEntity, engineCapacity?: DefaultCarEntity | null }) => {
  const content = document.querySelector('.content') as HTMLElement;
    const description = document.querySelector('.description') as HTMLElement;
    const list = document.createElement('ul');

    Object.keys(carData).forEach((key) => {
      // boundary check
      if (!carData[key as keyof typeof carData]) return;
      
      const item = document.createElement('li');
      item.textContent = `${key}: ${(carData[key as keyof typeof carData] as DefaultCarEntity).name} | ${(carData[key as keyof typeof carData] as DefaultCarEntity).value}`;
      list.appendChild(item);
    });

    description.appendChild(list);
    content.classList.add('visible');

    document.querySelector('.loading')?.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.loading')?.classList.add('visible');
  communication.emit(communication.actions.INJECT_CONTENT_SCRIPT);

  communication.listen(communication.actions.ERROR, (error: string) => {
    console.log('Error:', error);
    const loading = document.querySelector('.loading') as HTMLElement;
    loading.classList.remove('visible');
    const errorElement = document.querySelector('.error') as HTMLElement;
    errorElement.textContent = error;
    errorElement.classList.add('visible');
  });

  communication.listen(communication.actions.API_RESPONSE, apiResponseHandler);
  
  communication.listen(communication.actions.CLOSE, () => {
    window.close();
  });
});