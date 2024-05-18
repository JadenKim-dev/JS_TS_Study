const a = [] + 3;   // '3'
const b = {} + 3;   // 3
const c = {} + [];  // 0
const d = undefined + 3;  // NaN
const e = null + 3;  // 3

const obj = { name: 'HI' };
const cnt = obj.nama + '!!';  // 'undefined!!'

const sum = (a, b) => a + b;
sum(1, 2, 3);  // 3

type Name = { name: string };

const names: Name[] = [
	{ name: 'A' },
	{ nama: 'B' },
	{ nome: 'C' }
]

function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}
const three = add(1, 2); // number
const twelve = add('1', '2'); // string