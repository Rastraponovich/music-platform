import { Album, Tarif } from "@/types"

const albums: Album[] = [
    { id: 1, title: "Ядрена вошь", content: "новый альбом", backgroundImage: "yadrena-vosh.jpg" },
    { id: 2, title: "Куда преш", content: "новый альбом", backgroundImage: "kuda-presh.jpg" },
    {
        id: 3,
        title: "Тапки в тряпки",
        content: "новый альбом",
        backgroundImage: "tapki.jpg",
    },
    {
        id: 4,
        title: "Крути меня мошпит",
        content: "новый альбом",
        backgroundImage: "moshpit.jpg",
    },
]

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
]

export { albums, tarifCards }
