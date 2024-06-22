# 33. string 타입보다 더 구체적인 타입 사용하기

가능하다면 string 보다 구체적인 타입을 사용 해야 타입 서버의 도움을 받을 수 있다.  
다음의 예시에서도  releaseDate는 Date 타입으로, recordingType은 리터럴의 유니온으로 정의하여 더 구체적으로 타이핑 할 수 있다.  
이를 통해 잘못된 값이 삽입되는 것을 타입 단에서 막을 수 있다.  
또한 주석을 적용하여 타입의 의미를 설명하고, 다른 로직으로 값이 전달되어도 타입 정보를 유지할 수있다.

```ts
interface Album {
    artist: string;
    title: string;
    releaseDate: string; // YYYY-MM-DD
    recordingType: string; // "live" 또는 "studio"
}

/** 녹음이 이루어진 환경 */
type RecordingType = 'studio' | 'live';

interface Album {
    artist: string;
    title: string;
    releaseDate: Date;
    recordingType: RecordingType;
}

function getAlbumsOfType(recordingType: RecordingType): Album[] {
  // ...
}
```

보다 정밀하게 타입을 정의하기 위해 keyof를 사용할 수 있다.  
예를 들어 객체의 배열로부터 특정 속성으로 구성된 배열을 추출한다고 하자.  
실제로 lodash에서는 해당 기능을 하는 pluck 함수를 제공한다.  
이 때 추출 대상 객체를 제네릭으로 정의하고, 추출 하는 속성인 key를 그냥 string으로 정의하면 타입 에러가 발생한다.

```ts
function pluck<T>(records: T[], key: string): any[] {
    return records.map(r => r[key]);
    // {} 형식에 인덱스 시그니처가 없으므로 요소에 암묵적으로 any 형식이 있습니다.
}
```

이를 해결하기 위해서는 key를 마찬가지로 제네릭으로 정의하고, 제네릭 한정자 extends를 통해 keyof T의 서브타입으로 key를 제한해야 한다.  
제네릭 한정자를 사용하지 않고 그냥 keyof T로 지정하면 반환 타입이 각 속성에 맞게 좁혀지지 않고, (string | Date)[]처럼 추론된다.

```ts
function pluck<T, K extends keyof T>(records: T[], key: K): T[K][] {
    return records.map(r => r[key]);
}
```

이제 반환 타입이 제대로 추론되는 것을 확인할 수 있다.  
이제 에디터 사용 시 key 부분에 대한 자동 완성도 지원된다.

```ts
pluck(albums, 'releaseDate'); // Date[]
pluck(albums, 'artist'); // string[]
pluck(albums, 'recordingType'); // 타입이 RecordingType[]
pluck(albums, 'recordingDate'); // '"recordingDate"' 형식의 인수는 ... 형식의 매개변수에 할당될 수 없습니다.
```

string 타입은 any 타입과 유사한 문제를 가지고 있다.  
유효하지 않은 값을 허용하고 타입 간의 관계도 감출 수 있기 때문에, 가능하다면 보다 구체적인 타입을 사용해야 한다.
