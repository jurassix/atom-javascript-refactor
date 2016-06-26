'use babel';

import {React, ReactDOM} from 'react-for-atom';
import PathRenameForm from './PathRenameForm';
import {CompositeDisposable} from 'atom';

export default {

  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that refactors this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-refactoring-codemods:refactor': (e) => this.refactor(e)
    }));
  },

  deactivate() {
    console.log('in deactivate')
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.el = null;
  },

  refactor(e) {
    this.el = document.createElement('div');
    debugger
    const item = ReactDOM.render(
      <PathRenameForm
        previousPath={e.target.dataset.path}
        onClose={this.modalPanel.destroy}
      />
    , this.el);
    item.element = this.el;
    this.modalPanel = atom.workspace.addModalPanel({item}, this.el);
  }
};
