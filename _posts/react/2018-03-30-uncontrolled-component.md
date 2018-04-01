---
layout: post
title: React에서 File input 다루기 (Feat. Uncontrolled Component)
description: File input을 제어되는 컴포넌트로 다룰 수 있을까?
img: post_react.jpg
tags: [React, Uncontrolled Component]
author:
category: react
---
# React에서 File input을 제어되는 컴포넌트(Controlled Component)로 다룰 수 있을까

최근에 React 기반의 프로젝트를 진행하는 동안, Form 요소의 `file input`을 사용할 일이 있었고 그 과정에서 이 녀석을 어떻게든 **'제어되는 컴포넌트(Controlled Component)'**로 구현해보려고 애를 썼던 경험이 있다. 이때 새로 깨닫게 된 사실들을 글로 정리할 겸, 제어되는 컴포넌트와 제어되지 않는 컴포넌트에 대한 내용도 함께 정리해보기로 했다.

## React에서 Form 엘리먼트를 다루는 방법

React 세계에서 HTML Form 엘리먼트는 다른 DOM 엘리먼트들과는 약간 다른 방식으로 다뤄진다. HTML Form 엘리먼트들은 이미 자체적으로 자신의 내부 상태를 가진다는 사실로 인해, React 내장 상태(state)를 **신뢰 가능한 단일 소스(Single Source of Truth)**로 관리하고자 하는 설계 원칙에 위배되기 때문이다. 예를 들어, `div`와 같은 일반적인 DOM 엘리먼트는 그 자체적으로 어떤 상태도 갖지 않지만 `<input type="text" />`는 사용자의 입력에 따라 `value` 속성의 값이 변경되고 `<input type="checkbox" />`는 사용자의 선택 유무에 따라 `value` 속성의 값이 변경된다. React에서는 이런 독특한 특징을 갖는 Form 엘리먼트들을 다루기 위해 **'제어되는 컴포넌트(Controlled Component)'와 '제어되지 않는 컴포넌트(Uncontrolled Component)'**라는 두 가지 방법을 제공한다.

### 제어되는 컴포넌트(Controlled Component)

React에서 HTML Form 엘리먼트를 다룰 때, 해당 엘리먼트가 React 컴포넌트의 내장 상태 이외에 그 자체적으로 내부 상태를 갖기 때문에 상태 관리가 복잡해진다는 문제가 발생한다. 이 문제를 해결하기 위해, 각자 따로 존재하고 있는 **React 내장 상태(state)와 Form 엘리먼트가 자체적으로 갖고 있는 상태를 연결함으로써 React 컴포넌트의 내장 상태(state)를 신뢰 가능한 단일 소스(Single Source of Truth)로 만들 수 있다.** 이와 같이 input Form 엘리먼트의 값(value)이 React에 의해 제어되도록 만들 수 있는데, 이러한 방식을 '제어되는 컴포넌트(Controlled Component)'라고 한다.

```jsx
import React, { Component } from 'react'

export default class TextInput extends Component {
  state = { value: '' }

  handleChange = e => this.setState({ value: e.target.value })

  handleSubmit = e => {
    e.preventDefault()
    console.log(`Title: ${this.state.value}`)
  }

  render() {
    const { value } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          id="title"
          value={value}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}
```

위 코드를 천천히 살펴보자.

1. `<input type="text" />`에 사용자의 입력이 발생할 때마다 `onChange` 속성에 이벤트 핸들러로 등록된 `this.handleChange`가 실행되고, 해당 이벤트 핸들러는 실시간으로 사용자가 입력한 값을 `this.state.value`에 업데이트한다.
2. 업데이트된 `this.state.value`는 `<input type="text" />`에 `value` 속성으로 연결되어, 사용자의 입력에 따라 변경되는 `value` 값은 실시간으로 화면에 반영된다. 이로써 React 컴포넌트의 내장 상태에 저장된 `this.state.value`는 신뢰 가능한 단일 소스(Single Source of Truth)가 되었다.
3. 사용자가 전송 버튼을 클릭하면 `this.state.value`의 값을 읽어들여 콘솔에 출력한다. (`e.preventDefault()`는 단순히 Form 엘리먼트의 기본 동작 수행을 막기 위함이다.)

대다수의 경우에 Form 엘리먼트를 위와 같은 방식의 '제어되는 컴포넌트(Controlled Component)'로 구현하는 것이 권장된다. 그러나 기존에 존재하던 앱에 React 컴포넌트를 점진적으로 도입하고 있는 상황이라면, React 내장 상태와 Form 엘리먼트의 자체적 상태를 동기화시키기 위해 이벤트 핸들러를 작성하고 상태를 연결하는 작업은 꽤 번거로운 일로 느껴질 수 있다. 이러한 상황에서 사용할 수 있는 또 다른 대안이 바로 지금부터 소개할 '제어되지 않는 컴포넌트(Uncontrolled Component)'이다.

### 제어되지 않는 컴포넌트(Uncontrolled Component)

Form 관련 상태가 React의 내장 상태에 의해 관리되는 '제어되는 컴포넌트(Controlled Component)'와 달리, '제어되지 않는 컴포넌트(Uncontrolled Component)'는 그 상태가 DOM에 의해 자체적으로 다뤄진다. 때문에 React 컴포넌트 내부에서 DOM이 관리하는 상태 정보를 알아내기 위해서는 React 엘리먼트가 아닌 실제 DOM 엘리먼트에 직접적으로 접근할 수 있는 통로가 필요한데, 그 통로를 제공해주는 것이 바로 `ref` prop이다. `ref` prop에 넘겨진 콜백 함수는 `componentDidMount()` 또는 `componentDidUpdate()` 실행 직전에 호출되고 이 시점에 실제 DOM 엘리먼트에 대한 참조를 콜백 함수의 파라미터로 전달받는다. 이를 이용해 해당 컴포넌트의 인스턴스에 실제 DOM 엘리먼트에 대한 참조를 다음과 같이 저장할 수 있다.

```jsx
import React, { Component } from 'react'

export default class Input extends Component {
  componentDidMount() {
    // componentDidMount()의 실행에 앞서 `ref` prop에 넘겨진 콜백 함수가 실행되므로,
    // componentDidMount()가 실행되는 시점에 this.input을 통해 input DOM 엘리먼트를 참조할 수 있게 된다.
    console.log(this.input)
  }

  render() {
    return (
      // ref prop에 넘겨진 콜백 함수의 ref 파라미터로 실제 input DOM 엘리먼트에 대한 참조가 전달되고,
      // Form 컴포넌트의 인스턴스의 input 속성에 실제 input DOM 엘리먼트에 대한 참조를 저장한다.
      <input type="text" ref={ref => this.input = ref} />
    )
  }
}
```

mounting 라이프사이클에서 콘솔에 `this.input`을 출력하기까지의 과정은 다음과 같다.

1. `render()`가 실행되면서 `<input type="text" />`가 화면에 그려진다.
2. 실제 DOM 엘리먼트가 만들어진 직후에 `ref` prop으로 넘겨진 콜백 함수가 실행되고, 이 콜백 함수는 해당 컴포넌트의 인스턴스에 `input`이라는 이름으로 실제 DOM 엘리먼트에 대한 참조를 저장한다.
3. `componentDidMount()`의 실행에 앞서 `ref` prop에 넘겨진 콜백 함수가 실행되었으므로, 이 시점에서 `this.input`을 통해 실제 DOM 엘리먼트를 참조할 수 있게 된다.

일찍이 앞에서 '제어되는 컴포넌트'로 작성했던 TextInput 컴포넌트를 '제어되지 않는 컴포넌트'로 아래와 같이 작성할 수 있다.

```jsx
import React, { Component } from 'react'

export default class TextInput extends Component {
  handleSubmit = e => {
    e.preventDefault()
    console.log(`Title: ${this.input.value}`)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="title">Title: </label>
        <input type="text" id="title" />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}
```

제어되지 않는 컴포넌트(Uncontrolled Component)로 작성함으로써 코드의 길이는 더 짧아졌지만, Form 엘리먼트가 자체적으로 상태를 가지고 있기 때문에 규모가 더 커졌을 때 상태 관리가 복잡해지지 않을까 하는 걱정이 되기 시작한다. 그렇다면 도대체 언제 '제어되지 않는 컴포넌트'를 써도 되는지 궁금해진다.

### 언제 제어되지 않는 컴포넌트를 써도 괜찮은 것일까

많은 아티클에서 Form 엘리먼트를 다룰 때 제어되지 않는 컴포넌트보다 '제어되는 컴포넌트(Controlled Component)'로 작성하는 것이 더 좋다고 말한다. 실제로 맞는 말이다. React에서 `ref` prop을 통해 실제 DOM을 참조하는 것은 성능적인 부분에서 잠재적 위험이 있을 뿐더러, '제어되는 컴포넌트(Controlled Component)'로 작성하게 되면 React 컴포넌트의 내장 상태를 신뢰 가능한 단일 소스(Single Source of Truth)로 관리할 수 있기 때문이다. 이런 이유때문에 나는 최근 진행했던 프로젝트에서 `file input`을 어떻게든 '제어되는 컴포넌트(Controlled Component)'로 다뤄보고자 아래와 같이 창의적이고(?) 괴상한 방법을 시도했다.

```jsx
import React, { Component } from 'react'

export default class FileInput extends Component {
  state = { image: {} }

  handleChange = e => this.setState({ image: e.target.files })

  handleSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.state)
  }

  render() {
    const { image } = this.state
    return (
      <form onSumbit={this.handleSubmit}>
        <input type="file" files={image} onChange={this.handleChange} />
        <input type="button" value="submit" />
      </form>
    )
  }
}
```

내가 생각했던 실행 과정의 순서는 이랬다.

1. `<input type="file" />`에 사용자가 파일을 등록하면 `onChange` 속성에 이벤트 핸들러로 등록된 `this.handleChange`가 실행되고, 해당 이벤트 핸들러는 실시간으로 사용자가 등록한 파일을 `this.state.image`에 업데이트한다.
2. 업데이트된 `this.state.image`는 `<input type="file" />`에 `files` 속성으로 연결되어, 사용자가 등록한 파일명이 실시간으로 화면에 반영된다. 이로써 React 컴포넌트의 내장 상태에 저장된 `this.state.value`는 신뢰 가능한 단일 소스(Single Source of Truth)가 된다.
3. 사용자가 전송 버튼을 클릭하면 `this.props.onSubmit()`에 `this.state`를 전달하여 입력 데이터를 서버로 전송한다.

이 코드는 아무런 문제없이 아주 잘 동작했다. 그렇기 때문에 이 `file input`이 실제로 '제어되는 컴포넌트(Controlled Component)'가 되었다는 듯한 착각을 일으켰다. 그러나 사실은 전혀 그렇지 않았다. 중요한 사실을 간과하고 있었는데, **`file input`의 값(value)은 읽기 전용(read-only)이라는 것이다!** 이 말은 오로지 유저가 직접 파일을 등록하는 행위에 의해서만 값(value)이 변경될 수 있으며, 자바스크립트를 통해 프로그래밍적으로 직접 조작하는 것은 불가능함을 뜻한다. 즉, 내가 아무리 `<input type="file" />`의 `files` 속성에 값을 할당한다고 한들 그 값은 절대 변경되지 않는다. 이런 이유로 `file input`은 절대 '제어되는 컴포넌트(Controlled Component)'로 다뤄질 수 없다. 오로지 '제어되지 않는 컴포넌트(Uncontrolled Component)'로 작성되는 것만 가능하다. 단순히 내 주장이 아니라 [React 공식 문서](https://reactjs.org/docs/forms.html#the-file-input-tag)에 나와있는 내용이다.

앞에서 어설프게 '제어되는 컴포넌트'로 작성했던 `file input`을 다음과 같이 '제어되지 않는 컴포넌트'로 재작성할 수 있다.

```jsx
import React, { Component } from 'react'

export default class FileInput extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.fileInput.files[0])
  }

  render() {
    return (
      <form onSumbit={this.handleSubmit}>
        <input type="file" ref={ref => this.fileInput = ref} />
        <input type="button" value="submit" />
      </form>
    )
  }
}
```

위와 같은 상황에서는 제어되지 않는 컴포넌트(Uncontrolled Component)를 사용하는 것이 크게 문제되지 않는다. 어짜피 실제 DOM 엘리먼트의 값에 대한 참조가 실시간으로 필요한 것이 아니라 전송 버튼이 클릭되었을 때 딱 한 번만 필요하기 때문에
상태가 나누어 관리되고 있는 것을 크게 걱정할 필요가 없는 것이다. 언제 제어되는 컴포넌트와 제어되지 않는 컴포넌트를 써도 되는지에 대한 자세한 설명은 [이 아티클](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)을 확인하면 된다.

## References

1. [Forms - React 공식 문서](https://reactjs.org/docs/forms.html)
2. [Refs and DOM - React 공식 문서](https://reactjs.org/docs/refs-and-the-dom.html)
3. [Uncontrolled Components - React 공식 문서](https://reactjs.org/docs/uncontrolled-components.html)
4. [Controlled and uncontrolled form inputs in React don't have to be complicated - Gosha Arinich](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)