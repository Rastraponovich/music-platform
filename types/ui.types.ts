export const baseSkinColors = [
    "rgb(0,0,0)",
    "rgb(24,33,41)",
    "rgb(239,49,16)",
    "rgb(206,41,16)",
    "rgb(214,90,0)",
    "rgb(214,102,0)",
    "rgb(214,115,0)",
    "rgb(198,123,8)",
    "rgb(222,165,24)",
    "rgb(214,181,33)",
    "rgb(189,222,41)",
    "rgb(148,222,33)",
    "rgb(41,206,16)",
    "rgb(50,190,16)",
    "rgb(57,181,16)",
    "rgb(49,156,8)",
    "rgb(41,148,0)",
    "rgb(24,132,8)",
    "rgb(255,255,255)",
    "rgb(214,214,222)",
    "rgb(181,189,189)",
    "rgb(160,170,175)",
    "rgb(148,156,165)",
    "rgb(150,150,150)",
]
const UTF8_ELLIPSIS = "UTF8_ELLIPSIS"

export const FONT_LOOKUP: { [letter: string]: [number, number] } = {
    a: [0, 0],
    b: [0, 1],
    c: [0, 2],
    d: [0, 3],
    e: [0, 4],
    f: [0, 5],
    g: [0, 6],
    h: [0, 7],
    i: [0, 8],
    j: [0, 9],
    k: [0, 10],
    l: [0, 11],
    m: [0, 12],
    n: [0, 13],
    o: [0, 14],
    p: [0, 15],
    q: [0, 16],
    r: [0, 17],
    s: [0, 18],
    t: [0, 19],
    u: [0, 20],
    v: [0, 21],
    w: [0, 22],
    x: [0, 23],
    y: [0, 24],
    z: [0, 25],
    '"': [0, 26],
    "@": [0, 27],
    " ": [0, 30],
    "0": [1, 0],
    "1": [1, 1],
    "2": [1, 2],
    "3": [1, 3],
    "4": [1, 4],
    "5": [1, 5],
    "6": [1, 6],
    "7": [1, 7],
    "8": [1, 8],
    "9": [1, 9],
    [UTF8_ELLIPSIS]: [1, 10],
    ".": [1, 11],
    ":": [1, 12],
    "(": [1, 13],
    ")": [1, 14],
    "-": [1, 15],
    "'": [1, 16],
    "!": [1, 17],
    _: [1, 18],
    "+": [1, 19],
    "\\": [1, 20],
    "/": [1, 21],
    "[": [1, 22],
    "]": [1, 23],
    "^": [1, 24],
    "&": [1, 25],
    "%": [1, 26],
    ",": [1, 27],
    "=": [1, 28],
    $: [1, 29],
    "#": [1, 30],
    Å: [2, 0],
    Ö: [2, 1],
    Ä: [2, 2],
    "?": [2, 3],
    "*": [2, 4],
    "<": [1, 22],
    ">": [1, 23],
    "{": [1, 22],
    "}": [1, 23],
}

export type TIconSize = "extraSmall" | "small" | "normal" | "large" | "extraLarge"
