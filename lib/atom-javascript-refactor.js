'use babel';
// @flow
import { // eslint-disable-line import/no-extraneous-dependencies
  CompositeDisposable,
  Disposable,
} from 'atom';
import { createStore } from 'redux';
import { React, ReactDOM } from 'react-for-atom';
import os from 'os';
import PathRenameForm from './components/PathRenameForm';
import reducer from './reducer';
import renamePaths from './renamePaths';
import StatusBarTile from './StatusBarTile';

const AVAILABLE_CPUS = os.cpus().length - 1;

export default {

  store: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    cpus: {
      title: 'CPUS',
      description: '(all by default) Determines the number of processes started.',
      type: 'integer',
      default: AVAILABLE_CPUS,
    },
    extensions: {
      title: 'Extensions',
      description: 'File extensions the transform file should be applied to ' +
        '[js] (no leading dots...)',
      type: 'array',
      default: ['js'],
      items: {
        type: 'string',
      },
    },
    ignoreConfig: {
      title: 'Ignore Config',
      description: 'Ignore files if they match patterns sourced from a ' +
        'configuration file (e.g., a .gitignore) (must be relative to package root)',
      type: 'array',
      default: ['.gitignore', '.npmignore'],
      items: {
        type: 'string',
      },
    },
    ignorePattern: {
      title: 'Ignore Pattern',
      description: 'Ignore files that match a provided glob expression',
      type: 'array',
      default: ['.git', 'node_modules'],
      items: {
        type: 'string',
      },
    },
    runInBand: {
      title: 'Run in band',
      description: 'Run serially in the current process  [false]',
      type: 'boolean',
      default: 'false',
    },
  },

  activate() {
    this.store = createStore(reducer);
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-javascript-refactor:refactor': (e) => this.refactor(e),
      })
    );

    return this.subscriptions;
  },

  deactivate() {
    if (this.subscriptions) this.subscriptions.dispose();
    if (this.modalPanel) this.modalPanel.destroy();
    this.subscriptions = null;
    this.modalPanel = null;
    this.store = null;
    this.el = null;
  },

  consumeStatusBar(statusBar: atom$StatusBar) {
    const statusBarTile = this.statusBarTile = new StatusBarTile(this.store);
    const disposable = new Disposable(() => {
      if (this.statusBarTile) {
        this.statusBarTile.dispose();
        this.statusBarTile = null;
      }
    });
    statusBarTile.consumeStatusBar(statusBar);
    this.subscriptions.add(disposable);
    return disposable;
  },

  refactor(e: Event) {
    if (!(e.target instanceof HTMLElement)) {
      throw new Error('EventTarget must be an HTMLElement');
    }

    const onClose = () => {
      if (this.modalPanel) this.modalPanel.destroy();
    };

    const showLoader = () => this.store.dispatch({ type: 'refactor-start' });
    const hideLoader = () => this.store.dispatch({ type: 'refactor-end' });

    async function onRename({ previousPath, nextPath }) {
      onClose();
      showLoader();
      try {
        await renamePaths(previousPath, nextPath);
      } catch (runtimeError) {
        hideLoader();
        throw runtimeError;
      }
      hideLoader();
    }

    const previousPath = e.target.dataset.path;
    this.el = document.createElement('div');
    this.modalPanel = atom.workspace.addModalPanel({ item: this.el });
    ReactDOM.render(
      <PathRenameForm
        previousPath={previousPath}
        onClose={onClose}
        onRename={onRename}
      />
    , this.el);
  },
};
