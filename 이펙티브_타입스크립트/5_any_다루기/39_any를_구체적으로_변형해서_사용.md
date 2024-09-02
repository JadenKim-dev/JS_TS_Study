# 39. any를 구체적으로 변형해서 사용하기

any는 자바스크립트에서 표현할 수 있는 모든 값을 할당 가능한 큰 범위의 타입이다.  
가능하다면 any 보다는 좀 더 구체적인 타입을 사용해서 타입 안정성을 높이는 것이 좋다.

예를 들어, 특정할 수 없는 여러 값들의 배열을 매개변수로 받아야 할 때, 매개변수 타입을 any로 지정하는 것보다는 any[]로 지정하는 게 좋다.  
그래야 함수 호출 시 매개변수가 배열인지 체크될 수 있고, length와 같이 배열에서만 접근 가능한 속성 및 메서드에 대한 체크를 받을 수 있다.

```ts
function getLengthBad(array: any) {
  return array.length; // any
}

function getLength(array: any[]) {
  return array.length; // number
}

getLengthBad(/123/); // 오류 없음
getLength(/123/); //'RegExp' 형식의 인수는 'any[]' 형식의 매개변수에 할당될 수 없습니다.
```

또한 함수의 매개변수가 객체이지만 내부의 속성을 알 수 없다면, any 대신 `{[key: string]: any}` 처럼 인덱스 시그니처로 선언하는게 좋다.  
이 때 모든 비기본형 타입을 포함하는 object 타입을 사용하는 것도 가능하지만, object 타입은 객체의 속성에 접근하는 것이 불가능하다.  
이런 타입이 필요한 상황이라면 unknown 타입을 고려해보는 것이 좋다.

```ts
function hasTwelveLetterKey(o: { [key: string]: any }) {
  for (const key in o) {
    if (key.length === 12) {
      console.log(key, o[key]); // 속성 접근 가능
      return true;
    }
  }
  return false;
}

function hasTwelveLetterKey(o: { [key: string]: any }): boolean {
  for (const key in o) {
    if (key.length === 12) {
      console.log(key, o[key]); // '{}' 형식에 인덱스 시그니처가 없으므로 요소에 암시적으로 'any' 형식이 있습니다.
      return true;
    }
  }
  return false;
}
```

함수의 타입을 지정할 때에도 그 자체를 any로 지정하는 대신, 매개변수 또는 반환값에 any를 사용해서 필요한 부분에만 적용해야 한다.  
개수를 알 수 없는 여러 매개변수가 존재하는 경우에는 `...args: any[]` 처럼 지정하는 것도 가능하다.

```ts
type Fn0 = () => any; // 매개변수 없이 호출 가능한 모든 함수
type Fn1 = (arg: any) => any; // 매개변수 1개
type FnN = (...args: any[]) => any; // 모든 개수의 매개변수, "Function" 타입과 동일합니다.
```
