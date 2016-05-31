# draft-js-prism

[![NPM version](https://badge.fury.io/js/draft-js-prism.svg)](http://badge.fury.io/js/draft-js-prism)

`draft-js-prism` is a decorator for DraftJS to highlight code blocks using [Prism](https://github.com/PrismJS/prism).

![Prism](./preview.gif)

### Installation

```
$ npm install draft-js-prism
```

### Usage

```js
var Draft = require('draft-js');
var PrismDecorator = require('draft-js-prism');

var decorator = new PrismDecorator();
var editorState = Draft.EditorState.createEmpty(decorator)
```

You'll also need to include the css for one of the [Prism themes](https://github.com/PrismJS/prism/tree/gh-pages/themes).

You can use this decorator combined with others by using [draft-js-multidecorators](https://github.com/SamyPesse/draft-js-multidecorators)

