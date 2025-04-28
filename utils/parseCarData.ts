import Fuse from 'fuse.js';
import { carBrands } from './brands';
import { carModels } from './models';
import { fuelTypes } from './fuel';
import {
  CarBrand,
  CarModel,
  CarFuel,
  ConstantsLibrary,
  CarProductionYear,
  CarEngineCapacity,
  CarPrice,
} from './types';

export type RawCarData = {
  brand: string;
  model: string;
  fuel: string;
  productionYear: string;
  engineCapacity?: string;
  price: string;
};

export interface IParserCarData {
  carBrand: CarBrand;
  carModel: CarModel;
  carFuel: CarFuel;
  carProductionYear: CarProductionYear;
  carEngineCapacity?: CarEngineCapacity | null;
  rawCarData: RawCarData;
  carPrice: CarPrice;
  Searcher: typeof Fuse;
  validate(): void;
  parseBrand(): CarBrand;
  parseModel(): CarModel;
  parseFuel(): CarFuel;
  parseProductionYear(): CarProductionYear;
  parseEngineCapacity(): CarEngineCapacity | null;
  getCarAge(): number;
}

export class ParserCarData implements IParserCarData {
  rawCarData: RawCarData;
  constantsLibrary: ConstantsLibrary;
  Searcher: typeof Fuse;
  carBrand: CarBrand;
  carModel: CarModel;
  carFuel: CarFuel;
  carProductionYear: CarProductionYear;
  carEngineCapacity?: CarEngineCapacity | null;
  carPrice: CarPrice;
  constructor({
    rawCarData,
  }: {
    rawCarData: RawCarData;
  }) {
    this.rawCarData = rawCarData;
    this.Searcher = Fuse;
    this.constantsLibrary = {
      carBrands: carBrands,
      carModels: carModels,
      carFuels: fuelTypes,
    };
    this.carBrand = this.parseBrand();
    this.carModel = this.parseModel();
    this.carFuel = this.parseFuel();
    this.carProductionYear = this.parseProductionYear();
    this.carEngineCapacity = this.parseEngineCapacity();
    this.carPrice = this.parsePrice();
  }

  validate(): void {
    throw new Error('Not implemented');
  }

  parseBrand(): CarBrand {
    throw new Error('Not implemented');
  }

  parseModel(): CarModel {
    throw new Error('Not implemented');
  }
  
  parseFuel(): CarFuel {
    throw new Error('Not implemented');
  }

  parseProductionYear(): CarProductionYear {
    throw new Error('Not implemented');
  }

  parseEngineCapacity(): CarEngineCapacity | null {
    throw new Error('Not implemented');
  }

  parsePrice(): CarPrice {
    throw new Error('Not implemented');
  }

  getCarAge(): number {
    return new Date().getFullYear() - this.carProductionYear.value;
  }
  
  _simpleSearch<T extends (CarBrand | CarModel | CarFuel)>(
    list: T[],
    search: string,
    comporator: (item: T, search: string) => boolean = (item, search) => item.name === search
  ): T | undefined {
    return list.find((item) => comporator(item, search)) as T | undefined;
  } 
  
  _advancedSearch<T extends (CarBrand | CarModel | CarFuel)>(
    list: (CarBrand | CarModel | CarFuel)[],
    search: string
  ): T | undefined {
    const fuse = new this.Searcher(list, {
      includeScore: true,
      isCaseSensitive: false,
      keys: ['name'],
      threshold: 0.3,
      findAllMatches: false,
      shouldSort: true,
    });

    const result = fuse.search(search);

    return result?.[0]?.item as T | undefined;
  }
  
}

