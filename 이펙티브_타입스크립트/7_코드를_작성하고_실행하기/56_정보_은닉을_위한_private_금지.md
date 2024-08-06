# 56. 정보를 감추는 목적으로 private 사용하지 않기

타입스크립트에서는 public, protected, private 접근 제어자를 사용해서 클래스의 속성에 대한 접근 규칙을 지정할 수 있다.  
실제로 접근할 수 없는 속성에 접근하려고 하면 다음과 같이 타입 에러가 발생한다.

```ts
class Diary {
  private secret = "cheated on my English test";
}

const diary = new Diary();
console.log(diary.secret);
// 'secret' 속성은 private이며 'Diary' 클래스 내에서만 접근할 수 있습니다.
```

하지만 접근 제어자는 타입스크립트 키워드이기 때문에, 자바스크립트 컴파일 후에는 제거된다.  
따라서 런타임에는 정보를 은닉해주지 못하며, 심지어 단언문을 사용하면 타입스크립트 상태에서도 private 속성에 접근할 수 있다.

```ts
const diary = new Diary();
(diary as any).secret; // 정상
```

런타임에도 정보를 은닉하기 위한 가장 확실한 방법은 클로저를 사용하여 각 메서드를 정의하는 것이다.  
다음과 같이 생성자의 매개변수로 은닉할 정보를 받고, 생성자 내에서 각 메서드를 클로저로 정의하여 해당 메서드에서만 속성에 접근할 수 있도록 할 수 있다.

```ts
class PasswordChecker {
    checkPassword: (password: string) => boolean;

    constructor(passwordHash: number) {
        this.checkPassword = (password: string) => {
            return hash(password) === passwordHash;
        };
    }
}

const checker = new PasswordChecker(hash('s3cret’));
checker.checkPassword('s3cret'); // 결과는 true
```

이렇게 하면 외부에서 passwordHash에 접근할 수 없도록 은닉된다.  
다만 이 방법을 사용하면 은닉 속성에 접근하는 모든 메서드가 생성자에서 정의되어야 한다는 불편함이 있다.  
이 경우 인스턴스가 생성될 때마다 메서드의 복사본이 생성되기 때문에 메모리를 낭비하게 된다.  
또한 동일한 클래스의 인스턴스끼리도 정보가 철저하게 은닉되기 때문에, 서로의 은닉 속성에 접근하는 것이 불가능하다.

이 방법이 불편하다면 비공개 필드 기능을 이용하여 속성은 은닉할 수도 있다.  
접두사로 #을 붙이면 런타임과 타입 체크에서 모두 필드를 비공개로 만들 수 있다.  
또한 동일 클래스의 인스턴스끼리는 비공개 필드에 접근할 수 있다.

```ts
class PasswordChecker {
  #passwordHash: number;

  constructor(passwordHash: number) {
    this.#passwordHash = passwordHash;
  }

  checkPassword(password: string) {
    return hash(password) === this.#passwordHash;
  }
}

const checker = new PasswordChecker(hash("s3cret"));
console.log(checker.checkPassword("secret")); // 결과는 false
console.log(checker.checkPassword("s3cret")); // 결과는 true
```
