# 17. 변경 관련 오류 방지를 위해 readonly 사용

배열의 요소를 순회하여 합을 구하는 arraySum을 구현해보자.  
이 때 pop을 사용해서 요소를 순회하면 배열이 비워지게 된다.  
이러한 구현을 막기 위해 매개변수의 타입을 readonly number[]으로 지정할 수 있다.  
readonly number[]는 배열의 요소를 읽는 것만 허용하고, 배열을 변경하는 pop, push 등의 메서드를 사용할 수 없도록 제한한다.

```ts
function arraySum(arr: readonly number[]) {
  let sum = 0,
    num;
  while ((num = arr.pop()) !== undefined) {
    // 'readonly number[]' 형식에 'pop' 속성이 없습니다.
    sum += num;
  }
  return sum;
}
```

일반 배열은 pop, push 등의 메서드를 추가로 가진 것이기 때문에, 일반 배열이 readonly 배열의 서브타입이다.  
따라서 readonly 타입에 일반 배열을 할당하는 것은 가능하지만, 일반 타입에 readonly 배열을 할당하는 것은 불가능하다.

```ts
const a: number[] = [1, 2, 3];
const b: readonly number[] = a;
const c: number[] = a;
// 'readonly number[]' 타입은 'readonly'이므로 변경 가능한 'number[]' 타입에 할당될 수 없습니다.
```

타입스크립트에서는 기본적으로 함수가 매개변수를 수정하지 않는다고 가정한다.  
하지만 배열이나 객체 등의 내부 값을 수정하는 것은 막을 수 없다.  
매개변수가 수정되지 않아야 함이 분명하다면 readonly로 명시적으로 선언하는 것이 좋다.

다만 매개변수를 readonly로 선언한 경우, 해당 값을 이용해 다른 메서드를 호출할 때 타입 오류가 발생할 수 있다.  
예를 들어 readonly 배열로 변수를 선언한 경우, 일반 배열을 매개변수로 받는 다른 함수를 호출하는 것이 불가능하다.

```ts
function logArray(arr: number[]) {
  console.log(arr);
}

const a: readonly number[] = [1, 2, 3];
logArray(a);
// 'readonly number[]' 형식의 인수는 'number[]' 형식의 매개 변수에 할당될 수 없습니다.
```

호출한 함수가 직접 정의한 함수라면 함수의 정의를 바꾸면 되겠지만, 다른 라이브러리에서 정의한 함수일 경우 타입 단언을 사용해서 타입을 강제로 변환해서 호출해야 한다.

```ts
logArray(a as number[]);
```

### 변경 관련 오류 방지

readonly 타입을 사용하면 변경 관련해서 발생할 수 있는 다양한 오류를 방지할 수 있다.  
예를 들어 계행된 각 라인을 받아서, 문단 별로 배열로 묶어서 string[][] 형태로 반환하는 메서드를 구현해보자.  
이 때 currPara에 임시로 각 문단을 저장하고, 이를 전체 결과 변수인 paragraphs에 추가하는 방식으로 구현할 수 있다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const paragraphs: string[][] = [];
  const currPara: string[] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(currPara);
      currPara.length = 0; // 배열을 비움
    }
  };
  lines.forEach((line) => {
    if (line === "") {
      addParagraph();
    } else {
      currPara.push(line);
    }
  });
  currPara.push(line);
  return paragraphs;
}
```

하지만 이런 식으로 구현할 경우 paragraphs는 currPara의 참조를 가지게 되고, 매번 currPara가 비워져서 다음과 같이 빈 배열만 가지게 된다.

```ts
【[], [], []]
```

currPara에 담긴 배열을 직접 변경하는 것을 막기 위해 readonly로 선언하면 된다.  
이 경우 기존 코드에서 타입 오류가 발생하여, 수정이 필요한 상태가 된다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const paragraphs: string[][] = [];
  const currPara: string[] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(currPara);
      // readonly string[] 형식의 인수는 'string[]' 형식의 매개변수에 할당될 수 없습니다.
      currPara.length = 0;
      // 읽기 전용 속성이기 때문에 'length'에 할당할 수 없습니다.
    }
  };
  lines.forEach((line) => {
    if (line === "") {
      addParagraph();
    } else {
      currPara.push(line);
      // 'readonly string[]' 형식에 'push' 속성이 없습니다.
    }
  });
  currPara.push(line);
  return paragraphs;
}
```

이러한 오류를 고치기 위해, 먼저 currPara를 let으로 선언하는 것을 고려할 수 있다.  
let + readonly를 함께 사용하면 할당된 배열의 내용을 변경하는 것은 불가능하지만, 다른 배열을 가리키도록 할당을 변경할 수는 있다.  
이제 배열을 초기화할 떄에는 빈 배열을 새롭게 할당한다.  
또한 currPara에 각 line을 추가할 때에는 push 대신 concat을 사용하여, 이어붙인 배열을 재할당하도록 한다.  
이제 paragraphs의 타입을 `(readonly string!])[]`로 바꾸어서 currPara를 포함할 수 있게 하거나, `string[][]`로 유지하면서 타입 단언문을 사용하면 된다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const paragraphs: string[][] = [];
  let currPara: readonly string[] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(currPara as string[]);
      currPara = [];
    }
  };
  lines.forEach((line) => {
    if (line === "") {
      addParagraph();
    } else {
      currPara = currPara.concat([line]);
    }
  });
  currPara.push(line);
  return paragraphs;
}
```

### readonly는 얕게 동작한다.

readonly 타입은 얕게 동작한다는 것에 주의해야 한다.  
예를 들어 변수를 객체의 readonly 배열로 정의했다면, 그 안의 객체는 여전히 변경 가능하다.

```ts
const dates: readonly Date[] = [new Date()];
dates[0].setFullYear(2037); // 오류 없음
```

이는 객체에 대해서 사용되는 Readonly 제네릭에도 동일하게 적용된다.  
readonly 타입 내부의 nested된 객체는 여전히 수정 가능하다.

```ts
interface Outer {
  inner: {
    x: number;
  };
}
const o: Readonly<Outer> = { inner: { x: 0 } };
o.inner = { x: 1 }; // 읽기 전용 속성이기 때문에 'inner'에 할당할 수 없습니다.
o.inner.x = 1; // 정상
```

만약 깊은 readonly 타입을 사용하고 싶다면, 외부 라이브러리를 사용하면 좋다.
대표적으로 ts-essentials의 DeepReadOnly 제네릭을 사용할 수 있다.

### 인덱스 시그니처에 readonly 사용

인덱스 시그니처에 readonly를 적용하는 것도 가능하다.  
객체의 각 속성을 읽을 수는 있되 변경은 불가능하게 만들 수 있다.

```ts
let obj: { readonly [k: string]: number } = {};
// Readonly<{ [k: string]: number }> 도 가능

obj.hi = 45;
// { readonly [k: string]: number } 형식의 인덱스 시그니처는 읽기만 허용됩니다

obj = { ...obj, hi: 12 }; // 정상
```
