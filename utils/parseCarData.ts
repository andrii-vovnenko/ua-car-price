import Fuse from 'fuse.js';
import { carBrands } from './brands';
import { carModels } from './models';
import { fuelTypes } from './fuel';
import {
  CarBrand,
  CarModel,
  CarFuel,
  ConstantsLibrary,
  DefaultCarEntity,
} from './types';

export type RawCarData = {
  brand: string;
  model: string;
  fuel: string;
  productionYear: string;
  engineCapacity?: string;
};

export interface IParserCarData {
  rawCarData: RawCarData;
  carBrand?: DefaultCarEntity;
  carModel?: DefaultCarEntity;
  carFuel?: DefaultCarEntity;
  carProductionYear?: DefaultCarEntity;
  carEngineCapacity?: DefaultCarEntity | null;
  Searcher: typeof Fuse;
  validate(): void;
  parseBrand(): DefaultCarEntity;
  parseModel(): DefaultCarEntity;
  parseFuel(): DefaultCarEntity;
  parseProductionYear(): DefaultCarEntity;
  parseEngineCapacity(): DefaultCarEntity | null;
}

export class ParserCarData implements IParserCarData {
  rawCarData: RawCarData;
  constantsLibrary: ConstantsLibrary;
  Searcher: typeof Fuse;
  carBrand?: DefaultCarEntity;
  carModel?: DefaultCarEntity;
  carFuel?: DefaultCarEntity;
  carProductionYear?: DefaultCarEntity;
  carEngineCapacity?: DefaultCarEntity | null;
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
  }

  validate(): void {
    throw new Error('Not implemented');
  }

  parseBrand(): DefaultCarEntity {
    throw new Error('Not implemented');
  }

  parseModel(): DefaultCarEntity {
    throw new Error('Not implemented');
  }
  
  parseFuel(): DefaultCarEntity {
    throw new Error('Not implemented');
  }

  parseProductionYear(): DefaultCarEntity {
    throw new Error('Not implemented');
  }

  parseEngineCapacity(): DefaultCarEntity | null {
    throw new Error('Not implemented');
  }
  
  _simpleSearch(
    list: (CarBrand | CarModel | CarFuel)[],
    search: string,
    comporator: (item: DefaultCarEntity, search: string) => boolean = (item, search) => item.name === search
  ): DefaultCarEntity | undefined {
    return list.find((item) => comporator(item, search));
  } 
  
  _advancedSearch(
    list: (CarBrand | CarModel | CarFuel)[],
    search: string
  ): DefaultCarEntity | undefined {
    const fuse = new this.Searcher(list, {
      includeScore: true,
      isCaseSensitive: false,
      keys: ['name'],
      threshold: 0.3,
      findAllMatches: false,
      shouldSort: true,
    });

    const result = fuse.search(search);

    return result?.[0]?.item;
  }
  
}

