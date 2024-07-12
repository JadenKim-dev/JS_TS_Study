# 42. 모르는 타입의 값에는 any 대신 unknown을 사용하기

any 타입의 강력함은 어떤 타입도 any에 할당할 수 있고, 동시에 any 타입이 어떤 타입에든 할당할 수 있음에 있다.  
집합 체계에서 어떤 원소가 모든 집합의 부분 집합이면서 상위 집합일 수는 없는데, any는 이러한 원칙을 무시한다.  
타입 시스템은 집합 체계를 기반으로 동작하기 때문에, any를 사용하면 타입 체커가 무용지물이 된다.  
이와 달리 unknown은 어떤 타입이든 unknown에 할당할 수 있으나 unknown을 다른 타입에 할당하는 것은 불가능하다.  
unknwon은 집합 체계에서 유효한 타입(모든 타입의 상위 집합)으로, 타입 체커를 무효화하지 않고 활용 가능하다.

먼저 함수의 반환 타입에 unknown을 사용하는 방식에 대해서 살펴보자.  
yaml을 파싱하여 객체를 반환하는 parseYAML 메서드를 구현한다고 할 때, 반환 타입은 어떤 yaml이 주어지는지에 따라 유동적으로 변화한다.  
이 때 반환 타입으로 any를 사용하면 타입 체커의 지원을 받을 수 없다.

```ts
function parseYAML(yaml: string): any {
    // ...
}
const book = parseYAML(`
  name: Jane Eyre
  author: Charlotte Bronte
`);
alert(book.title); // 오류 없음, book.title은 undefined
book('read'); // 오류 없음, 런타임에 "TypeError: book은 함수가 아닙니다" 예외 발생
```

반환값을 받는 book 변수의 타입을 명시적으로 지정하면 타입 체크를 받을 수 있다.  
하지만 이것이 강제되지 않기 때문에 사용자가 타입 지정을 생략하면 암시적 any 타입이 코드에 퍼져나가게 된다.

이 때 unknown을 반환 타입으로 사용하면 더욱 타입 안전하게 사용할 수 있다.  
unknown 타입의 변수는 타입을 단언하기 전까지는 속성에 접근하거나 함수로 사용하는 것이 불가능하다.  
이를 통해 사용자가 명시적으로 타입을 지정하도록 강제할 수 있다.

```ts
function safeParseYAML(yaml: string): unknown {
    return parseYAML(yaml);
}

const book = safeParseYAML(`
  name: The Tenant of Wildfell Hall
  author: Anne Bronte
`);
alert(book.title); // 개체가 ’unknown’ 형식입니다.
book('read'); // 개체가 'unknown' 형식입니다.
```

정상적으로 book 변수를 사용하기 위해서는 다음과 같이 타입 단언을 수행해야 한다.

```ts
interface Book {
    name: string;
    author: string;
}

const book = safeParseYAML(`
  name: The Tenant of Wildfell Hall
  author: Anne Bronte
`) as Book
```