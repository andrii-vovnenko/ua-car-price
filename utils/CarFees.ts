import { IParserCarData } from '@/utils/parseCarData';

interface ICarFees {
  fullPrice: number;
  customsClearanceCosts: number;
  bondedCarCost: number;
}

export class CalculateCarFees {
  private car: IParserCarData;
  constructor(car: IParserCarData) {
    this.car = car;
  }

  async calculateCarFees(): Promise<ICarFees> {
    const url = new URL('https://auto.ria.com/content/news/calculateAuto/');
    url.searchParams.set('category', '1'); // 1 - легковые автомобили
    url.searchParams.set('fuel', this.car.carFuel.value.toString());
    url.searchParams.set('origin', '3'); // 3 - Europe 
    url.searchParams.set('age', this.car.getCarAge() > 15 ? 'gt15' : `lt${this.car.getCarAge()}`);
    url.searchParams.set('price', this.car.carPrice.value.toString());
    url.searchParams.set('engine', this.car.carEngineCapacity?.value.toString() ?? '');
    url.searchParams.set('currencyId', '2'); // 2 - EUR
    url.searchParams.set('langId', '4'); // 4 - Ukrainian

    const response = await fetch(url);
    const data = await response.json();

    return {
      fullPrice: data.newPrices?.clearedCarsCost ?? 0,
      customsClearanceCosts: data.newPrices?.customsClearanceCosts ?? 0,
      bondedCarCost: data.newPrices?.bondedCarCost ?? 0,
    };
  }

}
