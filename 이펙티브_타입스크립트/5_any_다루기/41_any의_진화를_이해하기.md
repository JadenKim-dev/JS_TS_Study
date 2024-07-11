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
