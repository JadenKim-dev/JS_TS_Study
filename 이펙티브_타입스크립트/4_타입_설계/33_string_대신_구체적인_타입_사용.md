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
