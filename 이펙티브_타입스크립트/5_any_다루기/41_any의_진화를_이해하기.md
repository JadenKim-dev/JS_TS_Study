# 41. any의 진화를 이해하기

타입스크립트의 변수 타입은 보통 변수 선언 시 정해지며, 새로운 값을 추가하여 확장하는 것은 불가늘하다.  
다만 암시적 any 타입은 예외적으로 타입이 확장될 수 있다.  
암시적 any 타입의 변수에 값을 할당하면 해당하는 값의 타입으로 any가 진화한다.

예를 들어 start에서 limit 까지의 숫자를 배열에 담아 반환하는 range 메서드를 구현해보자.  
아래 구현에서 반환 값인 out의 타입은 처음에는 `any[]` 였다가, 이후에 number 값들이 추가되면서 `number[]`로 진화했다.

```ts
function range(start: number, limit: number) {
  const out = []; // 타입이 any[]
  for (let i = start; i < limit; i++) {
    out.push(i); // out의 타입이 any[]
  }
  return out; // 타입이 number[]
}
```

배열에 다양한 요소를 삽입하면 해당 요소의 타입에 따라 타입이 진화한다.

```ts
const result = []; // any[]
result.push("a");
result; // string[]
result.push(1);
result; // (string | number) []
```

조건문에서는 분기에 따라 타입이 변하기도 한다.  
다음 코드에서 val 는 if 와 else 안에서 다른 타입을 가지고, 최종적으로 해당 타입들의 유니온 타입을 가지게 된다.

```ts
let val: any; // 타입이 any
if (Math.random() < 0.5) {
  val = /hello/;
  val; // 타입이 RegExp
} else {
  val = 12;
  val; // 타입이 number
}
val; // 타입이 number | RegExp
```

try catch 문에서도 비슷한 방식으로 동작하고, null로 초기값을 설정한 경우에도 any의 진화가 이루어진다.  
다음 예제에서는 somethingDangerous의 성공 여부에 따라 val에 12가 할당되는지가 달라지므로, `number | null` 타입으로 진화한다.

```ts
let val = null; // val의 타입은 any
try {
  somethingDangerous();
  val = 12;
  val; // 타입이 number
} catch (e) {
  console.warn("alas!");
}
val; // 타입이 number | null
```

any의 진화는 noImplicitAny가 설정된 상태에서 변수의 타입이 암시적 any인 경우에 발생한다.  
명시적으로 변수의 타입을 any[]로 지정한 경우에는 any의 진화가 발생하지 않는다.

```ts
let val: any;

if (Math.random() < 0.5) {
  val = /hello/;
  val; // any
} else {
  val = 12;
  val; // any
}

val; // any
```

암시적 any 타입의 변수에 아무런 값을 할당하지 않은 상태에서 접근하면 타입 에러가 벌생한다.

```ts
function range(start: number, limit: number) {
  const out = [];
  // 'out' 변수는 형식을 확인할 수 없는 경우 일부 위치에서 암시적으로 ‘any' 형식입니다.
  if (start === limit) {
    return out;
    // 'out' 변수에는 암시적으로 'any[]' 형식이 포함됩니다.
  }
  // 추가 로직이 필요할 경우 여기에 작성
}
```

이 때 암시적 any 타입은 함수 호출을 거칠 때에는 진화하지는 않는다는 점을 주의해야 한다.  
예를 들어 다음 코드의 forEach에서는 out에 number 값을 삽입했으나, forEach 밖에 있는 out의 타입은 진화되지 않았다.  
이 경우에는 map, filter 등을 통해서 새로운 배열을 생성하여 반환받는 식으로 any를 진화시켜야 한다.

```ts
function makeSquares(start: number, limit: number) {
  const out = [];
  // ~ 'out' 변수는 일부 위치에서 암시적으로 'any[]’ 형식입니다.
  range(start, limit).forEach((i) => {
    out.push(i * i);
  });
  return out;
  // ~ 'out' 변수에는 암시적으로 'any[]' 형식이 포함됩니다.
}
```

다만 any의 진화는 할당하는 값에 따라 유동적으로 타입이 변화하는 것이기 때문에, 타입을 안전하게 지키려면 명시적으로 타입을 지정해서 사용해야 한다.
