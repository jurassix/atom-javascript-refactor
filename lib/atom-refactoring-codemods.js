'use babel';

import { CompositeDisposable, Disposable } from 'atom';
import { React, ReactDOM } from 'react-for-atom';
import { resolve } from 'path';
import { statSync } from 'fs-plus';
import importDeclarationCodemodRunner from './transforms/importDeclarationCodemodRunner';
import importRelativeCodemodRunner from './transforms/importRelativeCodemodRunner';
import os from 'os';
import { createStore } from 'redux';
import reducer from './reducer';
import PathRenameForm from './components/PathRenameForm';
import renameFile from './utils/renameFile';
import StatusBarTile from './StatusBarTile';

const AVAILABLE_CPUS = os.cpus().length - 1;
const KEY_PATH = 'atom-refactoring-codemods';

function getUserOptions(projectRoot) {
  /* eslint-disable no-undef */
  const [{ value: userOptions }] = atom.config.getAll(KEY_PATH);
  const ignoreConfig = userOptions.ignoreConfig.reduce((ignorePaths, config) => {
    const filePath = resolve(projectRoot, config);
    try {
      statSync(filePath);
      ignorePaths.push(filePath);
    } catch (e) { /* eslint-disable no-empty */ }
    return ignorePaths;
  }, []);
  const extensions = userOptions.extensions.join(',');
  return {
    ...userOptions,
    ignoreConfig,
    extensions,
  };
}

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

  consumeStatusBar(statusBar) {
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

  refactor(e) {
    this.el = document.createElement('div');
    const onClose = () => this.modalPanel.destroy();
    const onRename = ({ previousPath, nextPath }) => {
      const [projectRoot] = atom.project.relativizePath(previousPath);
      if (renameFile(previousPath, nextPath)) {
        const userOptions = getUserOptions(projectRoot);

        this.store.dispatch({ type: 'refactor-start' });

        importRelativeCodemodRunner(
          nextPath,
          previousPath,
          nextPath,
          userOptions
        ).then(() =>
          importDeclarationCodemodRunner(
            projectRoot,
            previousPath,
            nextPath,
            userOptions
          )
        ).then(() => {
          this.store.dispatch({ type: 'refactor-end' });
        });
      }
      onClose();
    };
    this.modalPanel = atom.workspace.addModalPanel({ item: this.el });
    ReactDOM.render(
      <PathRenameForm
        previousPath={e.target.dataset.path}
        onClose={onClose}
        onRename={onRename}
      />
    , this.el);
  },
};
