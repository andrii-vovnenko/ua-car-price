import { IParserCarData, RawCarData, ParserCarData } from './parseCarData';
import { CarEngineCapacity, CarProductionYear, CarPrice } from './types';

export class ShadeautosParser extends ParserCarData implements IParserCarData {
  constructor({ rawCarData }: { rawCarData: RawCarData }) {
    super({ rawCarData });
    this.validate();
    
    this.carBrand = this.parseBrand();
    this.carModel = this.parseModel();
    this.carFuel = this.parseFuel();
    this.carProductionYear = this.parseProductionYear();
    this.carEngineCapacity = this.parseEngineCapacity();
    this.carPrice = this.parsePrice();
    this.carTransmission = this.parseTransmission();
  }

  validate(): void {
    if (
      !this.rawCarData.brand
      || !this.rawCarData.model
      || !this.rawCarData.fuel
      || !this.rawCarData.productionYear
      || !this.rawCarData.price
    ) {
      throw new Error('Invalid car data');
    }
  }

  parseTransmission(): CarTransmission | null {
    console.log(this.rawCarData.transmission);
    if (!this.rawCarData.transmission) return null;

    let transmission = this._simpleSearch<CarTransmission>(
      this.constantsLibrary.carTransmissions,
      this.rawCarData.transmission
    );
    if (transmission) return transmission;

    const transmissionParts = this.rawCarData.transmission.split(' ');

    while (transmissionParts.length > 0) {
      transmission = this._advancedSearch<CarTransmission>(
        this.constantsLibrary.carTransmissions,
        transmissionParts.join(' ')
      );
      if (transmission) return transmission;
      transmissionParts.pop();
    }

    return transmission || null;
  }

  parsePrice(): CarPrice {
    const price = this.rawCarData.price.replace(/\D/g, '').trim();

    if (price) {
      return {
        name: 'Price',
        value: parseInt(price),
      };
    }

    throw new Error('Invalid price');
  }

  parseEngineCapacity(): CarEngineCapacity | null {
    if (!this.rawCarData.engineCapacity) return null;

    const engineCapacity = this.rawCarData.engineCapacity.split(' ')[0];
    const engineCapacityNumber = engineCapacity;

    return {
      name: 'Engine capacity',
      value: parseFloat(engineCapacityNumber),
    };
  }

  parseProductionYear(): CarProductionYear {
    const [year, month] = this.rawCarData.productionYear
      .split('/')
      .map(p => p.replace(/\D/g, '').trim());

    if (/\d{4}/.test(year)) {
      return {
        name: year,
        value: parseInt(year),
      };
    }

    throw new Error('Invalid production year');
  }

  parseBrand(): CarBrand {
    let carBrand = this._simpleSearch<CarBrand>(
      this.constantsLibrary.carBrands,
      this.rawCarData.brand
    );

    carBrand = this._advancedSearch<CarBrand>(
      this.constantsLibrary.carBrands,
      this.rawCarData.brand
    );

    if (!carBrand) {
      throw new Error('Invalid brand');
    }

    return carBrand;
  }

  parseModel(): CarModel {
    if (!this.carBrand) {
      throw new Error('Brand not found');
    }

    let modelParts = this.rawCarData.model
      .replace(/[!]/g, '')
      .split(' ');
  
    let result: CarModel | undefined = undefined;
    
    while (modelParts.length > 0) {
      const model = modelParts.join(' ');
      result = this._simpleSearch<CarModel>(
        this.constantsLibrary.carModels[this.carBrand.value] || [],
        model
      );

      if (result) return result;
      modelParts.pop();
    }

    modelParts = this.rawCarData.model
      .replace(/[!]/g, '')
      .split(' ');
    
    while (modelParts.length > 0) {
      const model = modelParts.join(' ');
      result = this._advancedSearch<CarModel>(
        this.constantsLibrary.carModels[this.carBrand.value] || [],
        model
      );

      if (result) return result;
      modelParts.pop();
    }
  
    throw new Error('Invalid model');
  }

  parseFuel(): CarFuel {
    let carFuel = this._simpleSearch<CarFuel>(
      this.constantsLibrary.carFuels,
      this.rawCarData.fuel
    );

    carFuel = this._advancedSearch<CarFuel>(
      this.constantsLibrary.carFuels,
      this.rawCarData.fuel
    );

    if (!carFuel) {
      throw new Error('Invalid fuel');
    }

    return carFuel;
  }
}