import { IExchanger } from './Exchanger';

interface ICarAvaragePrice {
  getCarAvaragePrice({
    carBrand,
    carModel,
    carFuel,
    carProductionYear,
    carEngineCapacity,
  }: {
    carBrand: number;
    carModel: number;
    carFuel: number;
    carProductionYear: number;
    carEngineCapacity: number;
  }): Promise<number>;
}

export class AutoRiaAvaragePriceApi implements ICarAvaragePrice {
  private userId: string;
  private apiKey: string;
  private exchanger: IExchanger;
  constructor(userId: string, apiKey: string, exchanger: IExchanger) {
    this.userId = userId;
    this.apiKey = apiKey;
    this.exchanger = exchanger;
  }

  async getCarAvaragePrice({
    carBrand,
    carModel,
    carFuel,
    carProductionYear,
    carEngineCapacity,
  }: {
    carBrand: number;
    carModel: number;
    carFuel: number;
    carProductionYear: number;
    carEngineCapacity: number;
  }): Promise<number> {
    const response = await fetch(`https://developers.ria.com/auto/ai-avarage-price/?user_id=${this.userId}&api_key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        langId: 4,
        period: 365,
        params: {
          categoryId: '1',
          brandId: carBrand,
          modelId: carModel,
          year: {
            gte: carProductionYear - 1,
            lte: carProductionYear + 1,
          },
          fuelId: carFuel,
          engineVolume: {
            gte: (carEngineCapacity - 400) / 1000,
            lte: (carEngineCapacity + 400) / 1000,
          },
        },
      }),
    });

    const data = await response.json();

    const avaragePrice = data.statisticData?.find((item: any) => item.id === 'avgPriceBlock')?.price?.USD;
    return avaragePrice ? this.exchanger.exchangeUsdToEur(avaragePrice) : 0;
  }
}
