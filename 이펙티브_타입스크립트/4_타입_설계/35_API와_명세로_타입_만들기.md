# 35. 데이터가 아닌, API와 명세를 보고 타입 만들기

프로그램에서 다루는 타입들은 파일 형식, API, 명세 등과 같이 프로젝트 외부에 기반을 두는 경우가 많다.  
이 경우에는 예시 데이터가 아니라, 명세를 기반으로 타입을 정의해야 실수를 줄일 수 있다.  
라이브러리를 통해 공식적으로 지원되는 타입을 활용하거나, 자동으로 타입을 생성해주는 라이브러리를 활용해도 좋다.

예를 들어 Feature의 bounding box를 계산하는 메서드를 정의한다고 하자.  
이 경우에는 @types/geojson 에서 제공하는 GEO Json 타입을 이용하여 편리하게 코드를 작성할 수 있다.  
이 때 타입 체크를 통해 코드의 오류도 잡아낼 수 있다.  
아래 구현에서는 Feature가 coordinates를 가지지 않는 GeometryCollection 타입을 포함하므로, coordinates에 접근하는 부분에서 예외가 발생한다.

```ts
import { Feature } from 'geojson';

function calculateBoundingBox(f: Feature): BoundingBox | null {
  let box: BoundingBox | null = null;

  const helper = (coords: any[]) => {
    // ...
  };

  const { geometry } = f;

  if (geometry) {
    helper(geometry.coordinates);
    // 'Geometry' 형식에 'coordinates' 속성이 없습니다. 'GeometryCollection' 형식에 'coordinates' 속성이 없습니다.
  }

  return box;
}
```