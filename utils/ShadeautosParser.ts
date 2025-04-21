import { IParserCarData, RawCarData, ParserCarData } from './parseCarData';

export class ShadeautosParser extends ParserCarData implements IParserCarData {
  carBrand: DefaultCarEntity;
  carModel: DefaultCarEntity;
  carFuel: DefaultCarEntity;
  carProductionYear: DefaultCarEntity;

  constructor({ rawCarData }: { rawCarData: RawCarData }) {
    super({ rawCarData });
    this.validate();

    this.carBrand = this.parseBrand();
    this.carModel = this.parseModel();
    this.carFuel = this.parseFuel();
    this.carProductionYear = this.parseProductionYear();
  }

  validate(): void {
    if (
      !this.rawCarData.brand
      || !this.rawCarData.model
      || !this.rawCarData.fuel
      || !this.rawCarData.productionYear
    ) {
      throw new Error('Invalid car data');
    }
  }

  parseProductionYear(): DefaultCarEntity {
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

  parseBrand(): DefaultCarEntity {
    let carBrand = this._simpleSearch(
      this.constantsLibrary.carBrands,
      this.rawCarData.brand
    );

    carBrand = this._advancedSearch(
      this.constantsLibrary.carBrands,
      this.rawCarData.brand
    );

    if (!carBrand) {
      throw new Error('Invalid brand');
    }

    return carBrand;
  }

  parseModel(): DefaultCarEntity {
    let modelParts = this.rawCarData.model
      .replace(/[!]/g, '')
      .split(' ');
  
    let result: DefaultCarEntity | undefined = undefined;
    
    while (modelParts.length > 0) {
      const model = modelParts.join(' ');
      result = this._simpleSearch(
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
      result = this._advancedSearch(
        this.constantsLibrary.carModels[this.carBrand.value] || [],
        model
      );

      if (result) return result;
      modelParts.pop();
    }
  
    throw new Error('Invalid model');
  }

  parseFuel(): DefaultCarEntity {
    let carFuel = this._simpleSearch(
      this.constantsLibrary.carFuels,
      this.rawCarData.fuel
    );

    carFuel = this._advancedSearch(
      this.constantsLibrary.carFuels,
      this.rawCarData.fuel
    );

    if (!carFuel) {
      throw new Error('Invalid fuel');
    }

    return carFuel;
  }
}