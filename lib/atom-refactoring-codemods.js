'use babel';

import { CompositeDisposable, Disposable } from 'atom';
import { createStore } from 'redux';
import { getUserOptions, renameFile, getRepo, getDirectoriesSync } from './utils';
import { React, ReactDOM } from 'react-for-atom';
import importDeclarationCodemodRunner from './transforms/importDeclarationCodemodRunner';
import importRelativeCodemodRunner from './transforms/importRelativeCodemodRunner';
import os from 'os';
import PathRenameForm from './components/PathRenameForm';
import reducer from './reducer';
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
          const repo = getRepo(projectRoot);
          if (repo !== null) {
            getDirectoriesSync(projectRoot).forEach((filePath) =>
              repo.getDirectoryStatus(filePath)
            );
            atom.workspace.getTextEditors().forEach((editor) =>
              repo.getPathStatus(editor.getPath())
            );
          }
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
