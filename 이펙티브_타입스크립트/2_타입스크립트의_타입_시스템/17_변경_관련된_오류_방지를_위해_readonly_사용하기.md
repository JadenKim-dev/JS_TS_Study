# 17. 변경 관련 오류 방지를 위해 readonly 사용

배열의 요소를 순회하여 합을 구하는 arraySum을 구현해보자.  
이 때 pop을 사용해서 요소를 순회하면 배열이 비워지게 된다.  
이러한 구현을 막기 위해 매개변수의 타입을 readonly number[]으로 지정할 수 있다.  
readonly number[]는 배열의 요소를 읽는 것만 허용한다.  
배열을 변경하는 pop, push 등의 메서드를 사용할 수 없도록 제한한다.

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




















