# atom-refactoring-codemods package

[![Build Status](https://travis-ci.org/jurassix/atom-refactoring-codemods.svg?branch=master)](https://travis-ci.org/jurassix/atom-refactoring-codemods)
[![Coverage Status](https://coveralls.io/repos/github/jurassix/atom-refactoring-codemods/badge.svg?branch=master)](https://coveralls.io/github/jurassix/atom-refactoring-codemods?branch=master)
[![Dependency Status](https://david-dm.org/jurassix/atom-refactoring-codemods.svg)](https://david-dm.org/jurassix/atom-refactoring-codemods)
[![devDependency Status](https://david-dm.org/jurassix/atom-refactoring-codemods/dev-status.svg)](https://david-dm.org/jurassix/atom-refactoring-codemods#info=devDependencies)

## Atom JavaScript Module refactoring support

_atom-refactoring-codemods_ simplifies ES6 Module and CommonJS refactoring, by allowing you to rename or move any file within your project and have all references updated automatically.

_atom-refactoring-codemods_ allows you to rename a file and all Modules referencing that file will be updated too the new path. 

For example, given the following file:

_src/shot.js_

```js
import bar from './bar';
```

Let's rename the file **/src/bar.js** to **/src/glass.js**.

_src/shot.js_ is transformed to

```js
import bar from './glass';
```
 
_atom-refactoring-codemods_ also allows you to move a file and have all the internal references updated, and all Modules that reference this file will be updated too.

For example, given the following files:

_src/bar.js_

```js
import { ORDER } from '../constants';
```

_src/shot.js_

```js
import bar from './bar';
```

Let's move the file **/src/bar.js** to **/src/locations/bar.js**.

_src/bar.js_ is transformed to

```js
import { ORDER } from '../../constants';
```

_src/shot.js_ is transformed to

```js
import bar from './locations/bar';
```

#### Usage

Using the TreeView, __Right click__ on any __.js__ file to expose the _Rename (with refactor support)_ option. Selecting this option will open a modal that will allow you to update the file name or path. Pressing _Enter Key_ will apply the file rename/move and then run a [codemod](https://github.com/jurassix/refactoring-codemods) on the root folder.

_Note: there currently is no support for Drag and Drop._

### Install
```
apm i atom-refactoring-codemods
```

### Develop
```
> cd atom-refactoring-codemods
> npm i
> apm link
```

### Contribute
- Please open an [issue](https://github.com/jurassix/atom-refactoring-codemods/issues) before submitting a PR
- All PR's should be accompanied wth tests :rocket:
