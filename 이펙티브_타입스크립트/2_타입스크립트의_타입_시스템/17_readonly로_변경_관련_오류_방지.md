# 17. 변경 관련 오류 방지를 위해 readonly 사용

배열의 요소를 순회하여 합을 구하는 arraySum을 구현해보자.  
이 때 pop을 사용해서 요소를 순회하면 배열이 비워지게 된다.  
이러한 구현을 막기 위해 매개변수의 타입을 readonly number[]으로 지정할 수 있다.  
readonly number[]는 배열의 요소를 읽는 것만 허용하고, 배열을 변경하는 pop, push 등의 메서드를 사용할 수 없도록 제한한다.

```ts
function arraySum(arr: readonly number[]) {
    let sum = 0, num;
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


















