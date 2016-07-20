# atom-refactoring-codemods package

[![Build Status](https://travis-ci.org/jurassix/atom-refactoring-codemods.svg?branch=master)](https://travis-ci.org/jurassix/atom-refactoring-codemods)
[![Dependency Status](https://david-dm.org/jurassix/atom-refactoring-codemods.svg)](https://david-dm.org/jurassix/atom-refactoring-codemods)
[![devDependency Status](https://david-dm.org/jurassix/atom-refactoring-codemods/dev-status.svg)](https://david-dm.org/jurassix/atom-refactoring-codemods#info=devDependencies)

## JavaScript refactoring support for Atom

This package allows you to rename a file and have all internal relative imports/requires paths be updated to new location (if moved to a new dir) and all dependent files in your projects imports/requires be updated with your new file path.

This Atom package is a work in progress. The goal is to provide refactoring support to Atom, during file rename, file or directory move, and renaming of exported module.

The UI is a work in progress, all critiques are welcome - please read the _Contribute_ section below if you are interested in making this package better.

#### Usage

Right click on any .js file to expose the _Rename (with refactor support)_ option. Selecting this option will open a modalPanel that will allow the user to update the file path/name. Pressing _Enter Key_ will apply the file rename/move and then run a codemod on the root folder.

#### How it all works

__atom-refactoring-codemods__ is a UI package that executes jscodeshift codemods in memory. I've written 2 [refactoring-codemods](https://github.com/jurassix/refactoring-codemods) that do the heavy lifting of building the AST and updating the sources to match.

__import-declaration-transform__ updates all dependent _import/require_ __paths__ when a file has been renamed/moved. This codemod takes the _previousPath_ and _newPath_ of the file and then all dependent _import/require_ paths will be updated to match the new file name/location.

Example:

```js
import foo from './bar';
```

 becomes

 ```js
import foo from './new/path/to/bar';
 ```

__import-specifier-transform__ updates all dependent _import/require_ __variables__ when a file export been renamed. This codemod takes the _previousExportName_ and _newExportName_ for a given file and then all dependent _import/require_ variables will be updated to match the new file export name.

Example:

```js
import foo from './bar';

foo();
```

 becomes

 ```js
import fooPrime from './bar';

fooPrime();
 ```

#### Progress
- [x] Single File Rename with refactors
- [x] Directory Rename with refactors
- [ ] Export Rename with refactors
- [ ] Interactive Mode - show a panel with all refactors possible let user select/deselect files to update

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
