# 59. 타입스크립트 도입 전에 @ts-check와 JSDoc으로 시험해 보기

@ts-check 지시자를 사용하면 자바스크립트 파일에 대해서도 타입 체커가 파일을 분석해서 발견한 오류를 표시해준다.  
이 때 느슨한 수준으로 타입체크가 이루어지며, noImplicitAny 설정을 해제한 것보다 느슨하게 체크된다.  
다만 타입 불일치나 함수 매개변수 개수 불일치 등의 오류들을 잡아내기 때문에 의미가 있다.

```ts
// @ts-check
const person = {first: 'Grace', last: 'Hopper'};
2 * person.first // 산술 연산 오른쪽은 'any', 'number', 'bigint' 또는 열거형 형식이어야 합니다.
```

## 선언되지 않은 전역 변수

파일 내에서 전역 변수를 사용한다면, 변수를 인식할 수 있도록 별도의 타입 선언 파일을 만들어야 한다.  
다음 예제에서는 전역변수 user에 접근하기 위해 타입 선언 파일인 types.d.ts를 별도로 만들었다.  
타입 선언 파일을 인식하지 못 한다면 트리플 슬래시 참조를 사용해서 명시적으로 import 할 수도 있다.

```ts
// types.d.ts
interface UserData {
    firstName: string;
    lastName: string;
}
declare let user: UserData;

// 실행 파일
// @ts-check
/// <reference path="./types.d.ts" />
console.log(user.firstName); // 정상
```

## 알 수 없는 라이브러리

서드파티 라이브러리를 사용하는 경우, 해당하는 타입 선언을 설치하여 타입 정보를 참조할 수 있게 해야 한다.  
JQuery의 $ 의 경우에도 타입 선언을 설치해야 정상적으로 타입이 인식된다.

```
$ npm install —save-dev @types/jquery
```

```ts
// @ts-check
$('#graph').css({'width': '100px', 'height': '100px'}); // 오류 없음
```

이를 통해 타입스크립트 마이그레이션 전에 서드파티 라이브러리에 대한 타입을 체크해볼 수 있다.

## DOM 문제

