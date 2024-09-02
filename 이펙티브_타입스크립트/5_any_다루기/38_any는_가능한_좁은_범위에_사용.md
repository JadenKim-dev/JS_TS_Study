# 38. any 타입은 가능한 한 좁은 범위에서만 사용

any 타입은 가능한 좁은 범위에만 적용될 수 있도록 주의해서 사용해야 한다.  
예를 들어 Foo 타입의 변수가 문맥상으로 Bar 타입으로 사용 가능하다면, 해당 변수를 any 타입으로 선언하는 것과, 매개변수 할당 시 타입 단언을 하는 것이 가능하다.

```ts
function processBar(b: Bar) {
  /*...*/
}

function f1() {
  const x: any = expressionReturningFoo();
  processBar(x);
}

function f2() {
  const x = expressionReturningFoo();
  processBar(x as any);
}
```

둘 중에서는 두 번째 방법이 좀 더 좁은 범위에 any 타입을 적용하게 된다.  
f2에서는 매개변수로만 any 타입이 사용되고 다른 부분에는 영향을 미치지 않는다.  
이와 달리 f1에서는 x가 함수 내에서 계속 any 타입으로 사용되고, 만약 x를 반환하기라도 한다면 함수 바깥으로까지 any 타입이 누수된다.

> 이러한 상황을 방지하기 위해 함수의 반환값 타입은 유추되게 두는 대신 명시적으로 정의하는 것이 좋다.

```ts
function f1() {
  const x: any = expressionReturningFoo();
  processBar(x);
  return x;
}

function g() {
  const foo = f1(); // any
  foo.fooMethod(); // 타입이 체크되지 않음
}
```

위 문제를 해결하기 위해 문제가 되는 라인 위에 @ts-ignore를 붙이는 것도 가능하다.  
다만 이 경우 근본적은 원인을 해결한 것은 아니라서, 다른 부분에서 문제가 발생할 가능성이 높다.

```ts
function f1() {
  const x = expressionReturningFoo();
  // @ts-ignore
  processBar(x);
  return x;
}
```

객체의 특정 속성에 대한 타입 체크를 제거하는 경우에도 마찬가지로 any의 적용 범위를 최소화해야 한다.  
전체 객체를 any로 단언하면 모든 속성에 대한 타입 체크가 해제되지만, 특정 속성만을 any로 단언하면 해당 속성에 대한 체크만 해제된다.

```ts
const config: Config = {
  a: 1,
  b: 2, // 속성의 타입이 체크되지 않음
  c: {
    key: value,
  },
} as any;

const config: Config = {
  a: 1,
  b: 2, // 여전히 체크됨
  c: {
    key: value as any,
  },
};
```
