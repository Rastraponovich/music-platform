export type TResponse<T> = [T[], number];
export type Nullable<T> = T | null;

export type TarifLevel = "start" | "standard" | "super";

export type Tarif = {
  id: number;
  name: string;
  terms: string;
  price: number;
  level: TarifLevel;
  recomended: boolean;
};
