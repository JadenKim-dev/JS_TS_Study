# 53. 타입스크립트 기능보다는 ECMAScript 기능을 사용하기

타입스크립트 초기에는 자바스크립트의 부족한 기능을 보완하기 위해 자체적으로 클래스, 열거형, 모듈 시스템 등을 개발했다.  
하지만 자바스크립트에서 점차 부족했던 기능들을 내장 기능으로 추가하면서, 타입스크립트가 독자적으로 개발했던 기능들과 호환이 되지 않는 문제가 발생했다.  
타입스크립트에서는 기존의 기능들이 호환 가능하도록 새로운 기능을 끼워 맞추는 대신, 자바스크립트의 신규 기능들을 별도로 채택하는 방식을 선택했다.  
따라서 타입스크립트 초기에 개발된 일부 기능들은 자바스크립트의 신규 기능들로 대체해서 사용하는 것이 적절하다.

## 1) 열거형(enum)

사용을 지양해야 할 첫번째 기능은 enum 이다.  
enum은 값의 모음을 효과적으로 묶어내는 표현 방식으로, 여러 언어에서 사용된다.

```ts
enum Flavor {
  VANILLA = 0,
  CHOCOLATE = 1,
  STRAWBERRY = 2,
}

let flavor = Flavor.CHOCOLATE; // 타입이 Flavor

Flavor.VANILLA; // 0

Flavor[0]; // 값이 "VANILLA"
```

하지만 타입스크립트의 enum에는 몇가지 문제가 있다.  
숫자 enum의 경우 0, 1, 2 외의 다른 숫자를 할당할 경우 예상치 못하게 동작할 수 있다.  
또한 `const enum Flavor` 처럼 상수 열거형으로 사용할 경우, 런타임에 열거형 정보가 완전히 제거된다.  
즉 Flavor.CHOCOLATE이 0으로 대체되어 버리는 것으로, 이는 기대했던 것과 다른 동작이다.  
(preserveConstEnums 플래그를 설정하면 런타임 코드에서도 상수 열거형 정보를 유지한다.)

또한 문자열 enum은 구조적 타이핑이 아닌 명목적 타이핑을 사용하기 때문에 불편하다.  
예를 들어 아래 예시에서 구조적 타이핑에 따르면 `Flavor` 타입의 변수에는 문자열 리터럴로 `'strawberry'`로 지정하더라도 할당이 가능해야 할 것이다.  
하지만 문자열 enum은 명목적 타이핑을 따르므로, 반드시 `Flavor.CHOCOLATE` 처럼 명시적으로 열거형 값을 지정해줘야 할당 가능하다.

```ts
enum Flavor {
  VANILLA = "vanilla",
  CHOCOLATE = "chocolate",
  STRAWBERRY = "strawberry",
}

let flavor: Flavor = Flavor.CHOCOLATE; // 타입이 Flavor
flavor = "strawberry"; // '"strawberry"' 형식은 'Flavor' 형식에 할당될 수 없습니다.
```

이러한 모델링은 자바스크립트의 동작 방식에 위배된다.  
따라서 문자열 열거형을 사용하는 대신, 리터럴 타입의 유니온을 사용하는 것이 좋다.

```ts
type Flavor = "vanilla" | "chocolate" | "strawberry";
let flavor: Flavor = "chocolate"; // 정상
flavor = "mint chip";
//'mint chip' 유형은 'Flavor' 유형에 할당될 수 없습니다.
```

## 2) 매개변수 속성

일반적으로 자바스크립트에서는 생성자에서 매개변수를 이용하여 속성을 할당하는 문법을 사용한다.  
타입스크립트에서는 이를 생략하고, 매개변수에 속성을 명시하기만 하면 자동으로 속성이 할당되는 매개변수 속성 기능을 제공한다.

```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
// 매개변수 속성
class Person {
  constructor(public name: string) {}
}
```

하지만 매개변수 속성 기능은 타입스크립트의 다른 패턴들과 다소 이질적이다.  
일반적으로 타입스크립트 컴파일을 거치면 타입이 제거되어 코드가 줄어들지만, 매개변수 속성은 오히려 코드를 증가시킨다.  
또한 일반 속성들과 함께 사용될 경우 일관성을 해칠 수 있다는 문제가 있다.  
아래 예시에서도 first, last만 클래스 단에 나열되어 있고, name은 매개변수 속성으로 정의되어 있어서 일관성이 없다.

```ts
class Person {
  first: string;
  last: string;

  constructor(public name: string) {
    [this.first, this.last] = name.split(" ");
  }
}
```

매개변수 속성을 사용하는 것이 좋은지에 대해서는 논란이 있다.  
가능하다면 일반 속성과 매개변수 속성 중 한가지만을 사용하여 혼란을 줄이는 것이 좋다.
