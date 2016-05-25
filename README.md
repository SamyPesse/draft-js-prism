# draftjs-prism

[![Build Status](https://travis-ci.org/SamyPesse/draftjs-prism.png?branch=master)](https://travis-ci.org/SamyPesse/draftjs-prism)
[![NPM version](https://badge.fury.io/js/draftjs-prism.svg)](http://badge.fury.io/js/draftjs-prism)

`draftjs-prism` is a decorator for DraftJS to highlight code blocks using [Prism](https://github.com/PrismJS/prism).

![Prism](./preview.gif)

### Installation

```
$ npm install draftjs-prism
```

### Usage

```js
var Draft = require('draft-js');
var PrismDecorator = require('draftjs-prism');

var decorator = new PrismDecorator();
var editorState = Draft.EditorState.createEmpty(decorator)
```

You'll also need to include the css for one of the [Prism themes](https://github.com/PrismJS/prism/tree/gh-pages/themes).