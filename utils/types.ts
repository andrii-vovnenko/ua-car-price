export type DefaultCarEntity = {
  name: string;
};
export type CarBrand = DefaultCarEntity & {
  value: number;
};
export type CarModel = DefaultCarEntity & {
  value: number;
};
export type CarFuel = DefaultCarEntity & {
  value: number;
};
export type CarProductionYear = DefaultCarEntity & {
  value: number;
};
export type CarEngineCapacity = DefaultCarEntity & {
  value: number | string;
};

export type ConstantsLibrary = {
  carBrands: CarBrand[],
  carModels: Record<string, CarModel[]>,
  carFuels: CarFuel[]
}

