---
layout: post
title: create-react-app에서 import 간편하게 하기(+ ESLint 설정 추가)
description: Resolve absolute path
img: post_react.jpg
tags: [React, CRA, ESLint]
author:
category: react
---
# create-react-app에서 import 간편하게 하기

create-react-app(CRA)을 통해 생성한 프로젝트에서 디렉토리의 depth가 깊어졌을 경우, 특정 파일을 import하고자 상위 디렉토리로 이동하기 위해 `..`을 매번 연달아 사용하는 것은 꽤나 번거롭게 느껴진다.

```jsx
import Something from '../../../components/Something'
```

CRA에서는 import 경로를 커스터마이징할 수 있도록 `NODE_PATH` 환경 변수를 제공하고 있고, 이를 이용하면 프로젝트의 루트 디렉토리를 'src'로 인식하도록 설정함으로써 디렉토리의 depth가 얼마나 깊어졌는지에 상관없이 항상 아래와 같은 형식으로 import할 수 있게 된다.

```jsx
import Something from 'components/Something'
```

## 루트 디렉토리를 src 폴더로 설정하는 방법

### 1. .env 파일 이용

프로젝트의 루트 디렉토리에 .env 파일을 생성 후 아래와 같이 입력한다.

```plain
NODE_PATH=src
```

### 2. script 명령에 직접 NODE_PATH 설정

package.json을 열고 `scripts`의 `start`, `test` 명령에 `NODE_PATH`를 추가한다.

```json
  "scripts": {
    "start": "NODE_PATH=src react-scripts start",
    "build": "react-scripts build",
    "test": "NODE_PATH=src react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
```

## ESLint가 루트 디렉토리를 `src`로 인식하지 못하는 문제 해결하기

동작하는 데에는 아무런 문제가 없지만, 프로젝트에 ESLint를 사용하고 있다면 ESLint는 import 경로의 루트 디렉토리가 src임을 인식하지 못하기 때문에 에러를 내뿜는다.

***[eslint] Unable to resolve path to module 'Something'/ (import/no-unresolved)***

이 문제를 해결하기 위해 eslint 설정 파일(.eslintrc.json)에 다음 코드를 추가한다.

```json
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  }
```