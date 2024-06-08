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