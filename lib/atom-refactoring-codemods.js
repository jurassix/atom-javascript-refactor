'use babel';

import {React, ReactDOM} from 'react-for-atom';
import PathRenameForm from './PathRenameForm';
import importDeclarationCodemodRunner from './importDeclarationCodemodRunner';
import {CompositeDisposable} from 'atom';

const BASE_PATH_KEY = 'atom-refactoring-codemods.basePath';

export default {

  modalPanel: null,
  subscriptions: null,
  basePath: '',

  config: {
    basePath: {
      title: 'Base folder to apply refactors',
      description: 'Refactors will be applied to all *.js files under this folder',
      type: 'string',
      default: '/some/absolute/path',
    },
  },

  activate() {
    /* eslint-disable no-undef */
    this.basePath = atom.config.get(BASE_PATH_KEY);

    /* eslint-disable no-undef */
    atom.config.onDidChange(BASE_PATH_KEY, ({newValue}) => {
      this.basePath = newValue;
    });

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      /* eslint-disable no-undef */
      atom.commands.add('atom-workspace', {
        'atom-refactoring-codemods:refactor': (e) => this.refactor(e),
      })
    );

    return this.subscriptions;
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.el = null;
  },

  refactor(e) {
    this.el = document.createElement('div');
    const onClose = () => this.modalPanel.destroy();
    const onRename = ({previousPath, nextPath}) => {
      console.log(this.basePath, previousPath, nextPath);
      importDeclarationCodemodRunner(
        this.basePath,
        previousPath,
        nextPath
      );
    };
    this.modalPanel = atom.workspace.addModalPanel({item: this.el});
    ReactDOM.render(
      <PathRenameForm
        previousPath={e.target.dataset.path}
        onClose={onClose}
        onRename={onRename}
      />
    , this.el);
  },
};
