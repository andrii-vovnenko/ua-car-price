export type DefaultCarEntity = {
  name: string;
  value: number | string;
};

export type CarBrand = DefaultCarEntity;
export type CarModel = DefaultCarEntity;
export type CarFuel = DefaultCarEntity;

export type ConstantsLibrary = {
  carBrands: CarBrand[],
  carModels: Record<string, CarModel[]>,
  carFuels: CarFuel[]
}

