# 48. API 주석에 TSDoc 사용하기

사용자에게 공개하는 API에 주석을 작성할 때에는 JSDoc 스타일로 작성하는 것이 좋다.  
타입스크립트에서 사용할 때는 TSDoc으로 부르며, 대부분의 에디터에서는 타입스크립트 언어 서비스의 지원을 통해 TSDoc 스타일의 주석을 툴팁으로 보여준다.  

```ts
/** 인사말을 생성합니다. 결과는 보기 좋게 꾸며집니다. */
function greetJSDoc(name: string, title: string) {
    return `Hello ${title} ${name}`;
}
```

공개 API에 주석을 붙인다면, @param, @returns를 통해 매개변수 및 반환값에 대해서 주석을 작성할 수 있다.  
이 때에도 마찬가지로 함수 호출 부분에서 주석에 작성한 설명을 확인할 수 있다.

```ts
/**
 * 인사말을 생성합니다.
 * 
 * @param name 인사할 사람의 이름
 * @param title 그 사람의 칭호
 * @returns 사람이 보기 좋은 형태의 인사말
 */
function greetFuIITSDoc(name: string, title: string) {
    return `Hello ${title} ${name}`;
}
```

타입 정의에 TSDoc을 사용할 수도 있다.  
각 필드별로 설명을 작성하면 마찬가지로 에디터에서 지원을 받을 수 있다.

```ts
/** 특정 시간과 장소에서 수행된 측정 */
interface Measurement {
    /** 어디에서 측정되었나? */
    position: Vector3D;
    
    /** 언제 측정되었나? epoch에서부터 초 단위로 */
    time: number;
    
    /** 측정된 운동량 */
    momentum: Vector3D;
}
```

TSDoc은 기본적으로 마크다운 형식으로 구성되므로, 볼드체, 기울임, 글머리 기호 등을 활용 가능하다.

```ts
/**
 * 이 _interface_는 **세 가지** 속성을 가집니다.
 * 1. x
 * 2. y
 * 3. z
 */
interface Vector3D {
    x: number;
    y: number;
    z: number;
}
```

마지막으로 주의할 점은, 타입스크립트에서 타입 정보는 코드 내에 포함되므로 주석에는 포함시키지 말아야 한다는 것이다.
