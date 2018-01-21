---
layout: post
title: this가 undefined에 바인딩되었던 이유
description: Strict Mode에서의 this 바인딩 # Add post description (optional)
img: post_es2015.jpg # Add image post (optional)
tags: [tifo, this, strict, babel]
author: # Add name author (optional)
category: tifo
---
# 어째서 this가 undefined에 바인딩되었을까?

<br />

기본적으로 `function` 키워드로 정의된 함수 내부에서의 `this`는 **정의된 시점의 스코프가 아닌 호출되는 패턴에 따라** 바인딩 규칙이 달라진다. 이에 따라  `function` 키워드로 정의된 콜백함수 호출 패턴에서의 `this`는 ES2015의 화살표 함수를 사용하거나 명시적인 방법으로 `this`를 바인딩하지 않는다면, 전역 객체인 `window`에 바인딩된다. 심지어 객체의 메소드로 전달된 콜백함수라고 하더라도 말이다.

```javascript
const obj = {
  foo(callback) {
    callback();
  }
};

obj.foo(function(arr) {
  console.log(this);
}) // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
```

<br />

문제는 나와 함께 웹 프론트엔드 스쿨을 수강하고 있는 재훈이가 물어본 내용이었다. 원래 처음 물었던 내용은, 아래 코드의 BBSList 클래스 컴포넌트에서 클래스 필드로 정의한 `logout` 인스턴스 메소드에서 `firebase.auth().signOut()`에 후속 처리로 이어지는 `then` 메소드의 콜백 함수에 `function` 키워드를 사용하면 왜 문제가 발생하는지에 관한 것이었다. 물론 화살표 함수를 사용하면 자신을 포함한 스코프에서 `this`를 계승받으므로 간단히 문제가 해결되지만, `function` 키워드를 사용했을 때 `this`가 어디에 바인딩될 지 궁금해서 로그를 출력해보기로 했다. 나는, 어찌되었건 `this`가 콜백함수 호출 패턴으로 사용되었으므로 전역 객체 `Window`에 바인딩될 것이라고 예상했다.

```jsx
import React, { Component } from 'react';
import * as firebase from 'firebase';

export default class BBSList extends Component {

    logout = () => {
        console.log(this); //  BBSList {props: {...}, ...}
        firebase.auth().signOut()
          .then(function() {
            console.log(this); // undefined
            
            this.props.handleChangeState('login');
        }).catch(function (error) {
        });
    };
    render() {
        return (
            <div>
                <button onClick={this.logout}>logout</button>
            </div>
        );
    };
};
```

<br />

그러나 예상과 다르게 `this`는 `undefined`를 출력하고 있었다. `this`가 어째서 `Window`에 바인딩되지 않는 것인지 한참 고민하다가, 강사님께 질문했고 바로 답변을 얻을 수 있었다. 놓치고 있던 부분이 있었는데, 바로 **Babel에 의해 트랜스파일된 코드는 항상 Strict 모드로 동작**하고 있다는 것이었다. 일반적인 상황에서 `this`가 전역 객체에 바인딩되는 것은 개발자가 의도한 일이 아닐 것이기 때문에, Strict 모드에서는 `this`가 전역 객체에 바인딩되야 하는 상황이라면 이를 의도적으로 막고 어떤 것도 바인딩되지 않도록 한다. 실제로 [Babel REPL](http://babeljs.io/repl)에서 위 코드를 트랜스파일해보면, Strict 모드로 동작하고 있음을 직접 확인할 수 있다.

```javascript
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

// ...
```

<br />

몰랐던 내용은 아니었지만 이 문제를 통해 놓치고 있었던 부분을 다시 한 번 정확히 알 수 있었고, 이제는 정말 까먹지 말아야겠다! 사실 화살표 함수를 사용하면 간단히 해결될 문제라 꼭 알고 있어야 할 내용은 아니었는데, 그래도 궁금증을 말끔히 해결해서 다행이다.