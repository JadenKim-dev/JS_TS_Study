# 31. 타입 주변에 null 값 배치하기(null은 묶어서 한 번에 처리하기)

타입 설계 시 개별 값을 optional하게 두는 것보다는, 설계를 변경해서 타입의 속성들로 값들을 묶고 해당 타입 자체를 nullable하게 선언하는 것이 좋다.  
이렇게 하면 전체 값이 null이거나 null이 아닌 식으로 구분되기 때문에 타입을 다루기 더 쉬워진다.  

예제로 배열을 매개변수로 받아서 최솟값과 최댓값을 배열로 반환하는 메서드를 구현해보자.

```ts
function extent(nums: number[]) { // 반환 타입: (number | undefined)[]
  let min, max; // 둘 다 number | undefined
  for (const num of nums) {
    if (!min) {
      min = num;
      max = num;
    } else {
      // min: number; max: number | undefined;
      min = Math.min(min, num);
      max = Math.max(max, num);
      //'number | undefined' 형식의 인수는 'number' 형식의 매개변수에 할당될 수 없습니다.
    }
  }
  return [min, max];
}

const [min, max] = extent([0, 1, 2]);
const span = max - min; // 개체가 'undefined' 인 것 같습니다.
```

이 때 최댓값/최솟값 변수가 모두 optional 하게 설정되어 설계가 복잡해지고, 버그를 내제하게 되었다.  
먼저 min 또는 max 값이 0인 경우 널 체크의 결과가 true가 되어 값이 덮어씌워지는 버그가 존재한다.  
또한 함수 내부에서 min에 대한 null 체크만 이루어져 max는 여전히 undefined가 될 수 있는 상태가 되었고, 이에 따라 타입 오류가 발생했다.  
min과 max는 동시에 undefined이거나 number 이지만, 지금의 설계로는 이러한 정보를 포함할 수 없다.  
extent를 호출한 부분에서도 min, max 값에 대해서 모두 null 체크를 해야 number로 사용할 수 있다.

지금의 타입 설계를 변경하면 복잡도를 낮추고, 사용하기 쉬운 타입으로 로직을 구성할 수 있다.  
핵심은 min과 max를 한 객체 안에 넣고, 객체 자체를 nullable하게 선언하는 것이다.  
설계가 단순해지면서 내부 로직도 보다 직관적으로 작성할 수 있다.  
반환 받은 쪽에서도 반환 객체에 대한 null 체크나 타입 단언을 한 번만 거치면, 일반 타입으로 사용할 수 있게 된다.

```ts
function extent(nums: number[]) {
  let result: [number, number] | null = null;
  for (const num of nums) {
    if (!result) {
      result = [num, num];
    } else {
      result = [Math.min(num, result[0]), Math.max(num, result[1])];
    }
  }
  return result;
}

const [min, max] = extent([0, 1, 2])!;
const span = max - min; // 정상
```

## 클래스의 비동기 생성

비동기 작업을 통해서 데이터를 받아오고, 이를 이용하여 클래스를 생성해야 하는 경우를 생각해보자.  
이 때 클래스의 각 속성을 nullable하게 정의하여 로직을 구성하면 내부 메서드 등의 모든 로직을 복잡하게 만든다.  
아래 예시에서는 생성자로 UserPosts를 먼저 생성하여 각 값을 null로 설정하고, 그 다음 init 메서드를 호출하여 비동기 작업 수행 후 값을 설정하도록 했다.  
이로 인해 내부의 메서드는 모두 null을 허용하는 속성을 다뤄야 하고, 모두 null 체크를 수행해야 한다.  
속성값의 불확실성은 버그를 양산하기 쉽다.

```ts
class UserPosts {
  user: Userinfo | null;
  posts: Post[] | null;

  constructor() {
    this.user = null;
    this.posts = null;
  }

  async init(userId: string) {
    return Promise.all([
      (async () => this.user = await fetchUser(userId))(),
      (async () => this.posts = await fetchPostsForUser(userId))()
    ]);
  }

  getUserName() {
    // 구현이 애매함
  }
}
```

각 속성을 nullable하지 않게 구성하는 방식으로 설계를 바꿔보자.  
비동기 작업을 수행하는 init 메서드를 static 메서드로 변경하고, 비동기 작업이 끝난 뒤에 인스턴스를 반환하도록 구성하면 된다.

```ts
class UserPosts {
  user: Userinfo;
  posts: Post[];

  constructor(user: Userinfo, posts: Post[]) {
    this.user = user;
    this.posts = posts;
  }

  static async init(userid: string): Promise<UserPosts> {
    const [user, posts] = await Promise.all([
      fetchUser(userid),
      fetchPostsForUser(userid)
    ]);
    return new UserPosts(user, posts);
  }

  getUserName() {
    return this.user.name;
  }
}
```

이제 모든 속성은 null이 아니게 되었고, 메서드에서도 편리하게 속성을 사용할 수 있게 되었다.

> 속성을 Promise로 선언하는 식으로 구성하면 안 된다.  
> 속성이 Promise 타입이 되면 이를 다루는 모든 메서드가 비동기로 선언되어야 한다.
