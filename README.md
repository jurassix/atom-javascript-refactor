# atom-javascript-refactor package

[![Build Status](https://travis-ci.org/jurassix/atom-javascript-refactor.svg?branch=master)](https://travis-ci.org/jurassix/atom-javascript-refactor)
[![Coverage Status](https://coveralls.io/repos/github/jurassix/atom-javascript-refactor/badge.svg)](https://coveralls.io/github/jurassix/atom-javascript-refactor)
[![Dependency Status](https://david-dm.org/jurassix/atom-javascript-refactor.svg)](https://david-dm.org/jurassix/atom-javascript-refactor)
[![devDependency Status](https://david-dm.org/jurassix/atom-javascript-refactor/dev-status.svg)](https://david-dm.org/jurassix/atom-javascript-refactor#info=devDependencies)

## Atom JavaScript ES6 Module and CommonJS refactoring support

_atom-javascript-refactor_ simplifies ES6 Module and CommonJS refactoring, by allowing you to rename or move any file within your project and have all references updated automatically.

_atom-javascript-refactor_ allows you to rename a file, and all referencing Modules will be updated with new path.

For example, given the following file:

_src/animals.js_

```js
import cat from './meow';
```

Let's rename the file **src/meow.js** to **src/kitten.js**.

_src/animals.js_ is transformed to

```js
import cat from './kitten';
```

_atom-javascript-refactor_ also updates all locally referenced Modules inside of the moved file.

For example, given the following files:

_src/meow.js_

```js
import { RAINBOW } from '../constants';
```

_src/animals.js_

```js
import cat from './meow';
```

Let's move the file **src/meow.js** to **src/city-kitty/meow.js**.

_src/city-kitty/meow.js_ is transformed to

```js
import { RAINBOW } from '../../constants';
```

_src/animals.js_ is transformed to

```js
import cat from './city-kitty/meow';
```

#### Usage

Using the TreeView, __Right click__ on any __.js__ file or __directory__ to expose the _Rename (with refactor support)_ option. Selecting this option will open a modal that will allow you to update the file name or path. Pressing _Enter Key_ will apply the file rename/move and then run a [codemod](https://github.com/jurassix/refactoring-codemods) on the root folder.

_Note: there currently is no support for Drag and Drop._

### Install
```
apm i atom-javascript-refactor
```

### Develop
```
> cd atom-javascript-refactor
> npm i
> apm link
```

### Contribute
- Please open an [issue](https://github.com/jurassix/atom-javascript-refactor/issues) before submitting a PR
- All PR's should be accompanied wth tests :rocket:
