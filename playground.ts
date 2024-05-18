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
const twelve = add('1', '2'); // string

function logMessage(message: string | null) {
  if (message) {
    message
  }
}

const path = '/path/to/file';
path.split('/').slice(1).join('/') 

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
type a = TI['radius'];
type b = TC['call'];