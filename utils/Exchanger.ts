export interface IExchanger {
  exchangeUsdToEur(amount: number): Promise<number>;
}

export class Exchanger implements IExchanger {
  rate = 0.9;

  constructor() {
    this.rate = 0.9;
  }

  async exchangeUsdToEur(amount: number): Promise<number> {
    return amount * this.rate;
  }
}