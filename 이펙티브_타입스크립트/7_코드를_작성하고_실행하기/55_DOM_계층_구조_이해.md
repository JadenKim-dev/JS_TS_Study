# 55. DOM 계층 구조 이해하기

웹 브라우저에서 자바스크립트를 실행할 때에는 DOM 계층에 접근해야 하는 경우가 많다.  
타입스크립트에서는 DOM 계층에 대해서도 타입 체크를 수행하기 때문에, 수월하게 DOM 계층 구조를 파악할 수 있게 도와준다.  

DOM 계층은 총 5개 계층으로 구성되어 있다.

- EventTarget: window, XMLHttpRequest
- Node: document, Text, Comment
- Element: HTMLElement, SVGElement 포함
- HTMLElement: `<i>`, `<b>`
- HTMLButtonElement: `<button>`

EventTarget은 DOM 타입 중 가장 추상화된 타입이다.  
이벤트 리스너를 추가 및 제거하거나, 이벤트를 보내는 정도의 기능만을 가지고 있다.

다음과 같이 Event.currentTarget은 `EventTarget | null` 타입을 가진다.  
따라서 null 체크 후에 사용이 가능하고, classList 속성에는 접근이 불가능하다.  
런타임에서는 `eDown.currentTarget`의 타입이 HTMLElement 여서 접근이 가능할 수 있다.  
하지만 타입 관점에서는 window나 XMLHttpRequest도 될 수 있기 때문에 타입 에러가 발생한다.

```ts
function handleDrag(eDown: Event) {
    const targetEl = eDown.currentTarget;
    targetEl.classList.add('dragging');
    // 개체가 null인 것 같습니다.
    // 'EventTarget' 형식에 'classList' 속성이 없습니다.
}
```

다음으로 Node 타입은 각 Element와 함께, 텍스트 조각이나 주석을 포함하는 타입이다.  
예를 들어 다음과 같이 HTML 코드를 작성하고 엘리먼트의 속성을 확인해보면, childNodes 속성의 타입은 NodeList로 표시된다.  
NodeList는 Node의 컬렉션 타입으로, 텍스트 조각과 주석도 함께 포함하고 있음을 확인할 수 있다.  
이와 달리 children 속성에는 HTMLCollection 타입이 담겨있고, 자식 엘리먼트인 i 태그만을 포함하고 있다.

```ts
<p>
    And <i>yet</i> it moves
    <!-- quote from Galileo -->
</p>

> p.childNodes
NodeList(5) [text, i, text, comment, text]
> p.children
HTMLCollection [i]
```

다음으로, Element와 HTMLElement를 알아보자.  
Element는 HTMLElement를 포함하는 개념으로, svg 태그의 계층 구조를 포함하는 SVGElement도 Element를 포함한다.  
일반적인 html 태그들은 HTMLElement에 속한다.

마지막으로 HTMLxxxElement는 가장 구체적인 타입으로, 특성에 맞는 자신만의 고유 속성을 가지고 있다.(input의 value, img의 src)  
이런 속성에 접근하려면 타입이 해당 종류의 엘리먼트 타입이어야 하므로, 상당히 구체적으로 타입이 지정되어야 한다.  
'button' 같은 HTML 태그 값을 이용하면 정확한 타입을 얻을 수 있지만, document.getElementById 같은 메서드로는 더 추상적인 타입만 얻을 수 있다.  
이 때에는 타입 단언문을 이용하여 더 구체적인 타입을 지정할 수 있다.  
다만 getElementById는 null을 반환할 수도 있으므로 필요하다면 null 체크도 해야 한다.

```ts
document.getElementsByTagName(’p')[0]; // HTMLParagraphElement
document.createElement('button'); // HTMLButtonElement
document.querySelector('div'); // HTMLDivElement

document.getElementById('my-div'); // HTMLElement
document.getElementByld('my-div') as HTMLDivElement;
```


