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

콜백 함수를 매개변수로 받을 때 this 바인딩이 문제가 될 수 있다.  
예를 들어 클래스의 메서드를 콜백으로 넘겨야 한다고 하자.  
이 때 메서드가 this를 정상적으로 참조하게 하기 위해서는 생성자에서 명시적으로 바인딩을 해줘야 한다.

```ts
class ResetButton {
  constructor() {
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return makeButton({ text: "Reset", onClick: this.onClick });
  }

  onClick() {
    alert(`Reset ${this}`);
  }
}
```

이 문제를 해결하기 위해 onClick을 화살표 함수로 정의하는 것도 가능하다.  
화살표 함수로 생성하면 객체 생성 시점이 this가 인스턴스로 바인딩된 메서드를 생성하게 된다.

```ts
class ResetButton {
  render() {
    return makeButton({ text: "Reset", onClick: this.onClick });
  }

  onClick = () => {
    alert(`Reset ${this}`); // "this" 가 항상 인스턴스를 참조합니다
  };
}

// 자바스크립트의 실제 생성 코드
class ResetButton {
  constructor() {
    var _this = this;
    this.onClick = function () {
      alert("Reset " + _this);
    };
  }

  render() {
    return makeButton({ text: "Reset", onClick: this.onClick });
  }
}
```

또는 콜백 함수와 바인딩할 this를 함께 받는 식으로 문제를 해결할 수도 있다.  
콜백 함수의 첫번째 매개변수로 this를 전달하면 타입스크립트에서 특별하게 처리된다.  
콜백 함수 호출 시 call을 통해 this를 바인딩하여 호출하도록 강제되며, 일반 함수 호출을 시도하면 타입 에러가 발생한다.

```ts
function addKeyListener(
  el: HTMLElement,
  fn: (this: HTMLElement, e: KeyboardEvent) => void
) {
  el.addEventListener("keydown", (e) => {
    fn.call(el, e); // 정상
    fn(el, e); // 1개의 인수가 필요한데 2개를 가져왔습니다.
    fn(e); // 'void' 형식의 'this' 컨텍스트를 메서드의 'HTMLElement', 형식 'this'에 할당할 수 없습니다.
  });
}
```

이렇게 하면 해당 메서드에 넘기는 콜백 내에서 this를 참조할 수 있고, 타입 체크도 받을 수 있다.  
동적인 this 바인딩이 불가능한 화살표 함수를 넘긴 경우에도 타입을 체크해준다.

```ts
declare let el: HTMLElement;
addKeyListener(el, function (e) {
  this.innerHTML; // 정상, "this"는 HTMLElement 타입
});

class Foo {
  registerHandler(el: HTMLElement) {
    addKeyListener(el, (e) => {
      this.innerHTML; // 'Foo' 유형에 'innerHTML' 속성이 없습니다
    });
  }
}
```

만약 콜백 함수에서 this를 사용해야 한다면 this는 API의 일부가 되는 것이기 때문에, 반드시 타입 선언에 포함해야 한다.
