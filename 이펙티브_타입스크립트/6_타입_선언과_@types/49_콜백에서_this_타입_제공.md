# 49. 콜백에서 this에 대한 타입 제공하기

자바스크립트에서 this는 다이나믹 스코프를 가지기 때문에, this 값은 호출된 방식에 의해서 결정된다.  
보통 객체의 현재 인스턴스를 참조해야 하는 class에서 많이 사용된다.

```ts
class C {
  constructor() {
    this.vals = [1, 2, 3];
  }

  logSquares() {
    for (const val of this.vals) {
      console.log(val * val);
    }
  }
}

const c = new C();
c.logSquares();
```

이 때 logSquares는 내부적으로 C.prototype.logSquares를 호출하고, this 값을 c로 바인딩하는 두 가지 역할을 수행한다.  
해당 메서드를 별도의 참조 변수로 분리한 뒤 호출하면 this 값을 인스턴스로 바인딩 할 수 없게 된다.

```ts
const c = new C();
const method = c.logSquares;
method();

// Uncaught TypeError: undefined의 'vals' 속성을 읽을 수 없습니다.
```

자바스크립트에서는 this 바인딩을 명시적으로 제어할 수 있도록 제공한다.  
대표적으로 메서드 호출 시 call을 사용하면 명시적인 this 바인딩을 전달할 수 있다.

```ts
const c = new C();
const method = c.logSquares;
method.call(c);
```

this 바인딩을 제어하기 위해 종종 콜백 함수에 매개변수로 this가 포함된다.  
예를 들어 클래스의 메서드를 콜백으로 넘겨서 함수를 호출해야 한다고 하자.  
이 때 메서드가 this를 정상적으로 참조하게 하기 위해서는 생성자에서 명시적으로 바인딩을 해줘야 한다.

```ts
class ResetButton {
  constructor() {
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return makeButton({ text: 'Reset', onClick: this.onClick });
  }

  onClick() {
    alert(`Reset ${this}`);
  }
}
```
