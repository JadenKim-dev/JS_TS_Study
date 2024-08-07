# 45 devDependencies에 typescript와 `@types` 추가하기

npm의 devDependencies에는 프로젝트를 개발하고 테스트하는데는 필요하지만, 런타임에는 필요 없는 라이브러리들이 포함된다.  
타입스크립트의 타입 정보는 개발 중에만 사용되고 런타임에는 제거되기 때문에, 타입스크립트 관련 라이브러리는 일반적으로 devDependencies에 속한다.

타입스크립트 사용 시에는 공통적으로 2개의 의존성을 고려해야 한다.  
가장 먼저 고려해야 할 것이 타입스크립트 자체의 의존성이다.  
타입스크립트는 시스템 자체에 설치할 수도 있고 패키지 차원에서 devDependencies에 추가해서 설치할 수도 있다.  
이 때 타입스크립트를 devDependencies에 포함하면, 해당 package.json으로 npm 설치를 한 개발자들이 모두 동일한 타입스크립트 버전을 사용하도록 보장할 수 있다.  
대부분의 IDE와 빌드 도구들이 devDependencies에 등록된 타입스크립트 버전을 인식하여 동작하고 있고, npx를 이용하여 커맨드라인에서 패키지에 포함된 ts 컴파일러를 사용하는 것도 가능하다. (`npx tsc`)

다음으로 타입 의존성(`@types`)을 고려해야 한다.  
사용하려는 라이브러리에 타입 선언이 포함되어 있지 않더라도, DefinitelyTyped에서는 주요한 자바스크립트 라이브러리들에 대한 타입을 정의 및 유지보수 하고 있다.  
`@types` 스코프 아래에 있는 의존성을 설치하여 타입 정보를 받아올 수 있는데, 예를 들어 lodash의 타입 정보의 경우 `@types/lodash`에서 받아오는 식이다.  
이 때 원본 라이브러리는 dependencies에 있더라도 `@types` 의존성은 devDependencies에 위치 시켜서 배포 환경에서는 불필요하게 설치되지 않도록 해야 한다.
