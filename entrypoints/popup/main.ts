import { communication } from '../../utils/Comunication';
import { DefaultCarEntity } from '../../utils/types';

const apiResponseHandler = (carData: {
  brand: DefaultCarEntity,
  model: DefaultCarEntity,
  fuel: DefaultCarEntity,
  productionYear: DefaultCarEntity,
  engineCapacity?: DefaultCarEntity | null,
  price: DefaultCarEntity,
  customsCosts: DefaultCarEntity,
  fullPrice: DefaultCarEntity,
  avaragePrice: DefaultCarEntity,
  transmission?: DefaultCarEntity | null,
}) => {
  const content = document.querySelector('.content') as HTMLElement;
  const brandValue = document.querySelector('.brand-value') as HTMLElement;
  const modelValue = document.querySelector('.model-value') as HTMLElement;
  const fuelValue = document.querySelector('.fuel-value') as HTMLElement;
  const productionYearValue = document.querySelector('.production-year-value') as HTMLElement;
  const engineCapacityValue = document.querySelector('.engine-capacity-value') as HTMLElement;
  const priceValue = document.querySelector('.price-value') as HTMLElement;
  const avaragePriceValue = document.querySelector('.avarage-price-value') as HTMLElement;
  const customsCostsValue = document.querySelector('.customs-clearance-costs-value') as HTMLElement;
  const fullPriceValue = document.querySelector('.full-price-value') as HTMLElement;
  const transmissionValue = document.querySelector('.transmission-value') as HTMLElement;

  brandValue.textContent = carData.brand.name || 'n/a';
  modelValue.textContent = carData.model.name || 'n/a';
  fuelValue.textContent = carData.fuel.name || 'n/a';
  productionYearValue.textContent = carData.productionYear.name || 'n/a';
  engineCapacityValue.textContent = (carData.engineCapacity?.value as string) || 'n/a';
  priceValue.textContent = (carData.price.value.toString() as string) || 'n/a';
  avaragePriceValue.textContent = (carData.avaragePrice.value.toString() as string) || 'n/a';
  customsCostsValue.textContent = (carData.customsCosts.value.toString() as string) || 'n/a';
  fullPriceValue.textContent = (carData.fullPrice.value.toString() as string) || 'n/a';
  transmissionValue.textContent = (carData.transmission?.name || 'n/a') as string;
  content.classList.add('visible');
  document.querySelector('.loading')?.classList.remove('visible');
};

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.loading')?.classList.add('visible');
  communication.emit(communication.actions.INJECT_CONTENT_SCRIPT);

  communication.listen(communication.actions.ERROR, (error: string) => {
    console.log('Error:', error);
    const loading = document.querySelector('.loading') as HTMLElement;
    const errorElement = document.querySelector('.error') as HTMLElement;
    const errorMessage = document.querySelector('.error-message') as HTMLElement;
    
    loading.classList.remove('visible');
    errorMessage.textContent = error;
    errorElement.classList.add('visible');
  });

  communication.listen(communication.actions.API_RESPONSE, apiResponseHandler);
  
  communication.listen(communication.actions.CLOSE, () => {
    window.close();
  });
});