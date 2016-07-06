# atom-refactoring-codemods package

This Atom package is a work in progress. The goal is to provide refactoring support to Atom, during file rename, file | directory move, export rename.

The UI is a work in progress, all critiques are welcome - please read the _Contribute_ section below if you are interested in making this plugin better.

#### Usage

Right click on any .js file to expose the _Rename (with refactor support)_ option. Selecting this option will open a modalPanel that will allow the user to update the file path/name. Pressing _Enter Key_ will apply the file rename/move and then run a codemod on the root folder.

_**NOTE:** Currently, the **root folder** is set via the settings of this package; this will be inverted to an exclusion list, and this package will use the package.json as the root folder._

#### How it all works

__atom-refactoring-codemods__ is a UI plugin that executes jscodeshift codemods in memory. I've written 2 [refactoring-codemods](https://github.com/jurassix/refactoring-codemods) that do the heavy lifting of building the AST and updating the sources to match .

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
- [ ] Directory Rename with refactors
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
- please open an Issue before submitting a PR
- all PR's should be accompanied wth tests
