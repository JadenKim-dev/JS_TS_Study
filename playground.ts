// const a = [] + 3;   // '3'
// const b = {} + 3;   // 3
// const c = {} + [];  // 0
// const d = undefined + 3;  // NaN
// const e = null + 3;  // 3

// const obj = { name: 'HI' };
// const cnt = obj.nama + '!!';  // 'undefined!!'

// const sum = (a, b) => a + b;
// sum(1, 2, 3);  // 3

// type Name = { name: string };

// const names: Name[] = [
// 	{ name: 'A' },
// 	{ nama: 'B' },
// 	{ nome: 'C' }
// ]

function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}
const three = add(1, 2); // number
const twelve = add("1", "2"); // string

function logMessage(message: string | null) {
  if (message) {
    message;
  }
}

const path = "/path/to/file";
path.split("/").slice(1).join("/");

interface Person {
  name: string;
}

interface Lifespan {
  birth: Date;
  death?: Date;
}

type T = keyof (Person & Lifespan); // 'name' | 'birth' | 'death'
type K = keyof (Person | Lifespan); // never

// const list = [1, 2]; // 타입은 number[]
// const tuple: [number, number] = list;

const tuple: [number, number] = [1, 2];
const list: number[] = tuple;

type D = Exclude<string | Date, string | number>; // Date
type NonZeroNums = Exclude<number, 0>; // number

const num: NonZeroNums = 0;

// interface Cylinder {
//   radius: number;
//   height: number;
// }
// function Cylinder(radius: number, height: number) {
// 	this.radius = radius;
// 	this.height = height;
// }

// function calculateVolume(shape: unknown) {
//   if (shape instanceof {}) {
// 		shape
//     console.log(shape.radius);
//                     //~~~~~~ {} 형식에 'radius' 속성이 없습니다.
//   }
// }

class Cylinder {
  radius = 1;
  height = 1;
}

type TC = typeof Cylinder;
type TI = InstanceType<TC>;
type a = TI["radius"];
type b = TC["call"];

function logArray(arr: number[]) {
  console.log(arr);
}

const a: readonly number[] = [1, 2, 3];
logArray(a);
logArray(a as number[]);

function parseTaggedText(lines: string[]): string!][] {
  const paragraphs: string[] [] = [];
  const currPara: string!] = [];
  const addParagraph =()=>{
    if (currPara.length) {
      paragraphs.push(currPara);
      currPara.length = 0; // 배열을 비움
    }
  };
}

let ccc: readonly number = 3;
ccc = 2;


let obj: { readonly [k: string]: number } = {};
// Readonly<{ [k: string]: number }> 도 가능
obj.hi = 45;
// ... 형식의 인덱스 시그니처는 읽기만 허용됩니다

obj = { ...obj, hi: 12 }; // 정상
obj = { ...obj, bye: 34 }; // 정상

const c = 'c';

const axis1 = "x"; // "x"
let axis2 = "x"; // string


type Product = {
  name: string;
  id: string;
  price: number;
};

const elmo: Product = {
  name: "Tickle Me Elmo",
  id: "048188 627152",
};

const cache: {[ticker: string]: number} = {};
function getQuote(ticker: string): Promise<number> {
  if (ticker in cache) {
    return Promise.resolve(cache[ticker]);
  }
  return fetch(`https://quotes.example.com/?q=${ticker}`)
    .then(response => response.json())
    .then(quote => {
      cache[ticker] = quote;
      return quote;
    });
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}
function getComponent(vector: Vector3, axis: "x" | "y" | "z") {
  return vector[axis];
}

let x = "x";
x = "a";
x = "Four score and seven years ago...";

const rawRows = ["1234"];
const headers = ["name", "age", "city"];
const rows = rawRows.slice(1).map((rowStr) =>
  rowStr.split(",").reduce((row, val, i) => {
    row['1234'] = val;
    row[headers[i]] = val;
    // '{}' 형식에서 'string' 형식의 매개변수가 포함된 인덱스 시그니처를 찾을 수 없습니다.
    return row;
  }, {})
);

declare function map<U, V>(array: U[], fn: (this: U[], u: U, i: number, array: U[]) => V): V[];
function assertType<T>(x: T) {}

const beatles = ['john', 'paul', 'george', 'ringo'];

assertType<number[]>(
  map(beatles, function(name, i, array) {
    // ' (name: any, i: any, array: any) => any' 형식의 인수는
    // '(u: string) => any' 형식의 매개변수에 할당될 수 없습니다.

    assertType<string>(name);
    assertType<number>(i);
    assertType<string[]>(array);
    assertType<string[]>(this);
    // 'this'에는 암시적으로 'any' 형식이 포함됩니다.

    return name.length;
  })
);
