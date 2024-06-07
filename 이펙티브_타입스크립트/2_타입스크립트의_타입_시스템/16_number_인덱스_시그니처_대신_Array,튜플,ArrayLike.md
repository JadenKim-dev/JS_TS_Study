# number 인덱스 시그니처 대신 Array, 튜플, ArrayLike 사용하기

자바스크립트의 객체는 일반적으로 키 타입이 string이다.  
객체나 number를 키로 사용하면, 자동으로 문자열로 변환되어 저장된다.

```ts
> x[[1, 2, 3]] = 2
2
> x
{ '1,2,3': 1 }

> { 1: 2, 3: 4 }
{ '1': 2, '3': 4 }
```

이는 배열에 대해서도 동일하게 적용된다.  
자바스크립트 배열은 객체로, 각 인덱스 값을 키로 가진다.  
이 때 각 인덱스 숫자들은 문자열로 변환되어 저장된다.  
따라서 문자열 숫자를 이용해서 요소에 접근하는 것도 가능하고, Object.keys룰 이용해 키를 출력해도 문자열로 얻게 된다.

```ts
> x = [1, 2, 3]
> x['1']
2
> Object.keys(x)
['0', '1', '2']
```

하지만 타입스크립트에서는 배열과 객체를 명확히 구분하기 위해 number 키 타입을 허용한다.  
실제로 배열의 정의를 살펴보면 인덱스 시그니처의 키 타입으로 number가 지정되었음을 확인할 수 있다.

```ts
interface Array<T> {
  // ...
  [n: number]: T;
}
```

런타임의 키 타입은 string이기 때문에 실제 동작과 다른 가상 코드인 셈이다.  
하지만 이를 통해 타입 체크 시점에 배열과 객체를 명확히 구분할 수 있어 유용하다.

```ts
const xs = [1, 2, 3];
const x0 = xs[0]; // OK
const x1 = xs['1']; 
// 인덱스 식이 'number' 형식이 아니므로 요소에 암시적으로 'any' 형식이 있습니다.

function get<T>(array: T[], k: string): T {
  return array[k];
  // 인덱스 식이 'number' 형식이 아니므로 요소에 암시적으로 'any' 형식이 있습니다.
}
```

이 때 배열에 대한 Object.keys는 여전히 string[]을 반환한다.  
for...in을 사용하여 키를 순회할 경우 해당 키들을 참조하게 되므로, 키 타입이 string이 된다.  
엄격하게 타입을 적용한다면 해강 키로 값을 참조하는게 불가능하겠지만, 타입스크립트에서는 이를 허용하고 있다.  

```ts
const keys = Object.keys(xs); // string[]
for (const key in xs) {
  key; // string
  const x = xs[key]; // number
}
```

다만 굳이 인덱스를 참조해야 하는게 아니라면 for...of 로 키를 순회하는게 좀 더 직관적이다.  
반드시 인덱스 참조가 필요하다면 forEach를 이용해서 타입 안전하게 키를 순회할 수도 있다.

```ts
for (const x of xs) {
  x; // number
}

xs.forEach((x, i) => {
  i; // number
  x; // number
})；
```

### 인덱스 시그니처에 number 쓰지 않기

지금까지 배열이 인덱스 시그니처의 키 타입으로 number를 가진다는 것을 살펴봤다.  
배열 외에 number를 키 타입으로 가져야 하는 경우는 거의 없기 때문에, 필요한 경우 타입을 배열로 지정하는 것이 적절하다.

만약 배열에 포함된 concat, push 등의 메서드를 사용하지 못하도록 타입을 제한하고 싶다면, ArrayLike를 사용할 수 있다.  
ArrayLike는 배열과 비슷한 형태를 가지는 튜플로, 숫자로 된 인덱스 시그니처와 length만을 가진다.

```ts
const tupleLike: ArrayLike<string> = {
  '0': 'A',
  '1': 'B',
  length: 2,
};
```
