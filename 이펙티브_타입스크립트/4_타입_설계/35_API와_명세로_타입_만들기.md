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

해당 에러를 해결하기 위해서는 geometry의 타입을 체크해서 coordinates 속성을 가지는 타입인지를 확인해야 한다.  
이 때 함수로 해당 로직을 감싸서, GeometryCollection인 경우에는 내부의 geometries를 순회해서 적용하도록 구현하면 모든 타입에 대응하도록 할 수 있다.

```ts
const geometryHelper = (g: Geometry) => {
  if (g.type === 'GeometryCollection') {
    g.geometries.forEach(geometryHelper);
  } else {
    helper(g, coordinates); // 정상
  }
}

const { geometry } = f;
if (geometry) {
  geometryHelper(geometry);
}
```

이와 같이 명세로부터 타입을 작성하면 예외 상황을 누락하는 등의 실수를 줄여서, 가능한 모든 값에 대해서 로직이 동작함을 확신할 수 있다.  
이는 API의 경우도 마찬가지이기 때문에, 명세로부터 타입을 생성할 수 있다면 가능한 그렇게 해야 한다.  
특히 GraphQL은 타입 시스템을 통해 스키마에 가능한 모든 쿼리와 인타페이스를 명세하기 때문에 더욱 유리하다.  
예를 들어 저장소로부터 데이터를 요청하는 코드를 다음과 같이 작성하여 데이터를 응답 받을 수 있다.

```ts
query {
  repository(owner: "Microsoft", name: "TypeScript") {
    createdAt
    description
  }
}
```

```json
{
  "data": {
    "repository": {
      "createdAt": "2014-06-17T15:28:39Z",
      "description": "TypeScript is a superset of JavaScript that compiles to JavaScript."
    }
  }
}
```

GraphQL은 특정 쿼리에 대해 타입스크립트 타입을 생성할 수 있다.  
다음 쿼리는 Github 저장소에서 오픈소스 라이선스를 조회하는 쿼리이다.  
이 때 $owner와 $name을 String 타입의 GraphQL 변수로 정의했다.  
GraphQL의 String은 기본적으로 null을 허용하고, 뒤에 !를 붙여서 null이 아님을 명시한다.

```ts
query getLicense($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    licenseInfo {
      name
      url
    }
  }
}
```

이 때 GraphQL 쿼리를 타입스크립트 타입으로 변환해주는 여러 도구들이 존재하는데, 그 중 하나가 apollo 이다.  
다음의 커맨드는 https://api.github.com/graphql의 license.graphql 스키마로부터 타입스크립트 타입을 생성한다.

```bash
$ apollo client:codegen \
  --endpoint https://api.github.com/graphql \
  --includes license.graphql \
  --target typescript
```

이 때 다음과 같이 쿼리 매개변수에 대한 getLicenseVariables와 응답에 대한 getLicense 인터페이스가 생성된다.  
null 가능 여부도 응답 인터페이스로 변환되어 적절히 지정되었고, 주석은 JSDoc으로 변환되었다.

```ts
export interface getLicense_repository_licenseInfo {
  __typename: "License";
  /** Short identifier specified by <https://spdx.org/licenses> */
  spdxId: string | null;
  /** The license full name specified by <https://spdx.org/licenses> */
  name: string;
}

export interface getLicense_repository {
  __typename: "Repository";
  /** The description of the repository. */
  description: string | null;
  /** The license associated with the repository */
  licenseInfo: getLicense_repository_licenseInfo | null;
}

export interface getLicense {
  /** Lookup a given repository by the owner and repository name. */
  repository: getLicense_repository | null;
}

export interface getLicenseVariables {
  owner: string;
  name: string;
}
```

이렇게 자동으로 생성된 타입을 이용하면 타입과 실제값이 언제나 일치하는 것을 보장 받을 수 있다.  
명세 정보나 공식 스키마가 없다면 quicktype과 같은 도구를 사용해서 타입을 생성할 수 있다.  
하지만 이 경우에는 언제나 예외적인 경우가 존재할 수 있기 때문에 타입이 정확하지 않을 수 있음을 주의해야 한다.
