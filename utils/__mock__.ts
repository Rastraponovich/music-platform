import type { Tarif } from "@/types";

const tarifCards: Tarif[] = [
  {
    id: 1,
    name: "пидор",
    terms: "ты просто пидор",
    price: 49.99,
    level: "start",
    recomended: false,
  },
  {
    id: 2,
    name: "пидор классический",
    terms: "ты еще просто пидор но в туфлях",
    price: 89.99,
    level: "standard",
    recomended: false,
  },
  {
    id: 3,
    name: "супер пидор",
    terms: "все пидорские возможности и не только",
    price: 129.99,
    level: "super",
    recomended: true,
  },
];

export { tarifCards };
