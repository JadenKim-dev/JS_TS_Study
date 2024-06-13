# 25. 비동기 코드에는 콜백 대신 async 함수 사용하기

과거의 자바스크립트에서는 비동기 동작을 모델링 하기 위해 콜백을 사용했다.  
이후에 콜백 지옥을 개선하기 위해서 프로미스가 도입되었고, 이를 더욱 편리하게 사용하기 위해 async - await이 도입되었다.  
타입스크립트에서는 예전 버전의 ES에서도 async - await이 동작하도록 변환을 수행하기 때문에, 런타임에 관계 없이 async - await을 사용할 수 있다.  
따라서 타입스크립트에서는 가능한 async - await을 사용해서 코드 작성을 쉽게 하고, 더 나은 타입 추론을 받을 수 있게 해야 한다.

예를 들어 Promise.all을 사용하면 손 쉽게 병렬 처리 및 결과를 가져올 수 있다.  
이를 콜백을 사용해서 구현하려면 코드도 복잡하고, 타입 구문도 더 많이 삽입된다.  
Promise.all과 달리 콜백에서는 에러 처리를 포함하기도 어렵다.

```ts
async function fetchPages() {
  // 결과가 각각 Response 타입
  const [response1, response2, response3] = await Promise.all([
    fetch(url1), fetch(url2), fetch(url3)
  ]);
  // ...
}

function fetchPagesCB() {
  let numDone = 0;
  const responses: Response[] = []; // 타입 지정 필요
  const done = () => {
    const [response1, response2, response3] = responses;
    // ...
  };
  const urls = [url1, url2, url3];
  urls.forEach((url, i) => {
    fetchURL(url, r => {
      responses[i] = r;
      numDone++;
      if (numDone === urls.length) done();
    });
  });
}
```

Promise.race도 타입 추론과 잘 맞는다.  
Promise.race의 반환 타입의 경우 입력 타입들의 유니온으로 결정된다.  
보통 시간이 초과하면 예외를 던지도록 구현하는 경우가 많은데, 이 때 에러를 던지기만 하는 프로미스의 반환 타입은 Promise<never>로 결정된다.  
이 때 일반 프로미스 결과와 유니온되어 반환 타입이 Promise<Response | never>가 되고, 이는 타닙 시스템 내에서 Promise<Response>로 단순해진다.

```ts
function timeout(millis: number): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), millis);
  });
}

// 추론된 반환 타입은 Promise<Response>
async function fetchWithTimeout(url: string, ms: number) {
  return Promise.race([fetch(url), timeout(ms)]);
}
```










