## 5. any 타입 지양하기

타입스크립트에서는 any 타입을 적용하여 코드의 특정 부분에 대한 타입 체크를 해제하는 것이 가능하다.  
any를 일부분에라도 사용하면 타입 시스템의 신뢰도가 떨어져서 타입스크립트의 장점을 상당 부분 잃게 된다.  
때로는 any 타입이 불가피 할 때도 있지만, 그 경우에도 any의 위험성을 잘 이해하고 사용해야 한다.

### any 타입에는 타입 안전성이 없다.

아래 예제에서 age는 number 타입으로 선언되었으나, '12'가 any 타입으로 단언되어 값으로 삽입되었다.  
이로 인해 age는 숫자 타입이라는 가정 하에 로직이 구성되지만, 런타임에서는 다른 방식으로 동작하게 된다.  
변수 하나가 any 타입으로 선언되면서 관련된 코드들의 타입 안정성을 잃게 되었다.

```ts
let age: number;

age = '12'; // '"12"' 형식은 'number' 타입에 할당할 수 없습니다.
age = '12' as any; // 정상

age += 1; // 런타임에 정상, age는 "121"
```

### any는 함수 시그니처를 무시한다.

함수를 정의할 때는 시그니처를 명시하여, 호출하는 쪽에서는 약속된 타입의 입력을 제공하고, 함수는 약속된 타입의 출력을 제공한다.  
하지만 any 타입을 사용하면 이러한 규칙을 무시할 수 있다.  
다음 예제에서는 birthDate가 any 타입으로 선언됨에 따라, 런타임에는 string 값이 할당되었는데도 타입 에러 없이 Date 타입 매개변수로 사용되고 있다.

```ts
function calculateAge(birthDate: Date): number {
  // ...
}
let birthDate: any = '1990-01-19';
calculateAge(birthDate); // 정상
```

자바스크립트는 암시적인 타입 변환을 지원하여 number 타입이 string 으로 자동 변환되어 사용되는 등 예상치 못한 동작이 발생할 수 있다.  
이로 인해 예상하지 못한 부분에서 오류가 발생한다.

### any 타입에는 언어 서비스가 적용되지 않는다.

특정 심볼에 타입이 있다면, 타입스크립트의 언어 서비스의 도움을 받을 수 있다.  
`자동 완성`, `도움말 제공`, `이름 변경`은 언어 서비스가 제공하는 대표적인 편의 기능이다.  
하지만 any 타입을 사용하는 로직에서는 이러한 기능들의 지원을 받을 수 없다.  
타입스크립트를 사용하는 핵심적인 이유가 언어 서비스의 지원을 받아서 생산성을 향상시키는 것인데, any 타입을 사용하면 이것이 불가능하다.

### any 타입은 코드 리팩토링 시 버그를 감춘다.

매개변수의 타입을 변경하는 등 함수를 리팩터링 할 때에는, 타입 정의와 함수 정의를 모두 수정해야 한다.  
하지만 any 타입으로 매개변수가 정의되어 있다면, 리팩토링 과정에서 타입 체크의 도움을 받을 수 없다.

아래 예제에서는 특정 아이템을 선택하면 onSelectItem 콜백을 실행하는 컴포넌트를 정의했다.  
타입 정의에서 콜백의 매개변수는 any 타입으로 정의되었고, 실제 함수 정의에서도 매개변수를 any 타입으로 정의했다.

```ts
interface ComponentProps {
  onSelectItem: (item: any) => void;
}

function renderSelector(props: ComponentProps) { /* ... */ }

let selectedId: number = 0;

function handleSelectItem(item: any) {
  selectedId = item.id;
}
renderSelector({ onSelectItem: handleSelectItem });
```

이 떄 콜백의 매개변수로 id를 직접 받도록 하기 위해, 타입 정의에서 매개변수로 number 타입을 받도록 리팩토링 했다고 하자.  
이 때 id를 직접 받도록 함수의 정의를 함께 바꾸지 않았다면 런타임에서 오류가 발생하지만, 매개변수에 정의된 any 타입으로 인해 타입 체크에서 이를 걸러낼 수 없다.

```ts
interface ComponentProps {
  onSelectItem: (id: number) => void;  // 리팩토링으로 인한 변경
}

function renderSelector(props: ComponentProps) { /* ... */ }

function handleSelectItem(item: any) {
  selectedId = item.id;  // 리팩토링 되지 않음
}
renderSelector({ onSelectItem: handleSelectItem }); // 타입 에러가 발생하지 않음
```

### any는 타입 설계를 감춰버린다.

어플리케이션의 상태 객체에는 수많은 속성이 포함되며, 타입 정의 시 이들을 모두 지정해줘야 한다.  
any를 사용하면 이러한 수고를 덜 수 있지만, 이 경우 상태 객체의 설계를 감춰버려서 모든 코드를 들춰내야만 그 설계를 유추할 수 있게 된다.  
any 타입을 사용하면 설계가 불분명해짐을 인지해야 하고, 가능한 모든 타입을 일일이 작성해줘야 한다.

### any는 타입시스템의 신뢰도를 떨어뜨린다.

any로 인해 지정한 타입과 런타임 타입이 불일치하게 되면, 더 이상 타입 시스템을 신뢰할 수 없게 된다.  
개발 시 런타임의 타입과 지정한 타입을 모두 신경 써야 한다.
