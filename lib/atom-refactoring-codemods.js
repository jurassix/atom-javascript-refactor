'use babel';

import {React, ReactDOM} from 'react-for-atom';
import PathRenameForm from './PathRenameForm';
import {CompositeDisposable} from 'atom';

export default {

  modalPanel: null,
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    /* eslint-disable no-undef */
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-refactoring-codemods:refactor': (e) => this.refactor(e),
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.el = null;
  },

  refactor(e) {
    this.el = document.createElement('div');
    const onClose = () => this.modalPanel.destroy();
    const item = ReactDOM.render(
      <PathRenameForm
        previousPath={e.target.dataset.path}
        onClose={onClose}
      />
    , this.el);
    item.element = this.el;
    this.modalPanel = atom.workspace.addModalPanel({item}, this.el);
  },
};
