---
layout: post
title:  블로그 테스트 6
date:   2017-08-25 13:32:20 +0300
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: post-html.jpg # Add image post (optional)
tags: [Blog, This]
author: Adam Neilson # Add name author (optional)
category: javascript
permalink: /learn/css3/:title/
---
## 1 Day

### 1. 값 더 알아보기

#### 1.1 블록 스코프

1. 특별한 기능이 없는 블록을 만들 수도 있다. 객체와 유사하게 중괄호로 코드의 일부분을 둘러싸면 된다.

   ```javascript
   {
     let i = 0;
   }
   console.log(i); // ReferenceError: i is not defined
   ```

<br />

#### 1.2 함수 호출

1. 만약 함수 호출 시에 객체를 인자로 넘긴다면, 이 때 역시 **실제로 복사되는 것은 객체 자체가 아니라 참조**이다. 그래서, 우리는 이 참조를 이용해 **원본 객체의 내용을 변경할 수 있다.** 원본이나, 복사된 참조나 **같은 객체를 가리키기 때문이다.**

2. 아래 코드에서 `obj`가 실제 heap에 저장된 객체에 대한 참조를 담고 있을 때, `obj`를 `addProp(o)` 함수에 인자로 전달하면 `o`에는 `obj`가 참조하고 있는 같은 객체에 대한 참조 주소가 복사된다.

   ```javascript
   const obj = {};

   function addProp(o) {
     o.prop = 1;
   }

   // 변수 `obj`에 저장되어 있는 참조가 매개변수 `o`에 복사된다.
   addProp(obj);

   console.log(obj.prop); // 1
   ```

<br />

#### 1.3 객체의 같음

1. 프로그램을 작성하다가 객체에 대한 비교를 하는 코드를 짜고 있는 자신을 발견하게 되면, 지금 객체의 내용을 비교하려고 하는 것인지, 또는 객체의 참조를 비교하려고 하는 것인지를 꼭 생각해보자. 객체의 내용을 통해 비교하고 싶다면, 깊은 비교 기능을 지원하는 [라이브러리](https://www.npmjs.com/package/fast-deep-equal)를 이용하거나, 정확히 어떤 내용을 비교하고 싶은지를 가지고 **함수 혹은 메소드**를 작성한 후 그것을 이용하면 된다.

   ```javascript
   // npm install fast-deep-equal
   var equal = require('fast-deep-equal');
   console.log(equal({foo: 'bar'}, {foo: 'bar'})); // true 
   ```

<br />

#### 1.4 불변성(Immutability)

1. 가변인 값은 어디서 어떻게 변경될 지 알 수 없다. 변경되지 말아야 할 객체가 있다면, 정말로 변경되지 않도록 신경 써서 코드를 작성해야 한다. 그러나 객체가 정말로 변경되지 않았는지를 확인하는 일은 쉽지 않아서, 때때로 **객체의 가변성 때문에 프로그래밍이 어려워지기도 한다.**

2. 객체의 가변성 때문에 어려움을 겪고 있다면, 두 가지 해결책을 시도해볼 수 있다.

   1. 먼저 `Object.freeze`의 사용을 고려해볼 수 있다. `Object.freeze`는 객체를 **얼려서** 속성의 추가, 변경, 삭제를 막는다. 다만 `Object.freeze`를 호출한다고 해서 **객체 안에 있는 객체**까지 얼려버리지는 않으므로, 중첩된 객체에는 `Object.freeze`를 사용하기가 조금 까다롭다. 그리고, 다음에 소개할 방법과 비교하면 여러모로 편의성이 떨어진다.

      ```javascript
      const obj = {prop: 1};

      Object.freeze(obj);

      // 모두 무시된다.
      obj.prop = 2;
      obj.newProp = 3;
      delete obj.prop;

      console.log(obj); // { prop: 1 }
      ```

   2. 다음으로 [Immutable.js](https://facebook.github.io/immutable-js/) 같은 라이브러리의 사용을 고려해보자. 이런 라이브러리들은 `Object.freeze`처럼 객체를 정말로 얼려버리지는 않지만, 객체를 **마치 불변인 것처럼** 다룰 수 있는 방법을 제공한다. 다시 말하면, 이 객체들은 메소드를 통해 내용이 조금이라도 변경되면 아예 새로운 객체를 반환한다. 즉, **내용이 달라지면 참조 역시 달라지게 되어** 객체의 내용이 변경되었는지를 확인하는 작업이 아주 쉬워진다. 아래는 Immutable.js에서 제공하는 `List`를 활용한 예제이다.

      ```javascript
      import {List} from 'immutable';

      // Immutable.js에서 제공하는 `List`는 배열과 유사하지만, 불변인 것처럼 다룰 수 있는 자료구조입니다.
      const list = List.of(1, 2, 3);
      const newList = list.push(4); // 새 List 인스턴스를 반환합니다.

      // 내용이 달라지면, 참조도 달라집니다.
      list === newList; // false
      ```

   <br />

#### 1.5 래퍼 객체(Wrapper Object)

1. `String.prototype.valueOf()` 메소드를 이용하여 String 객체 타입을 원시 타입의 값으로 되돌릴 수 있다.

<br />

> 인용 블록 입니다. this is blockquote.



![Yosh Ginsu]({{site.baseurl}}/assets/img/yosh-ginsu.jpg)


