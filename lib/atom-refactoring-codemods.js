'use babel';

import {CompositeDisposable} from 'atom';
import {React, ReactDOM} from 'react-for-atom';
import importDeclarationCodemodRunner from './importDeclarationCodemodRunner';
import PathRenameForm from './PathRenameForm';
import renameFile from './renameFile';
import os from 'os';

const AVAILABLE_CPUS = os.cpus().length - 1;
const KEY_PATH = 'atom-refactoring-codemods'

export default {

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
        'configuration file (e.g., a .gitignore)',
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
      const [projectRoot] = atom.project.relativizePath(previousPath);
      const [{value: userOptions}] = atom.config.getAll(KEY_PATH);
      if (renameFile(previousPath, nextPath)) {
        importDeclarationCodemodRunner(
          projectRoot,
          previousPath,
          nextPath,
          {
            ...userOptions,
            extensions: userOptions.extensions.join(','),
          }
        );
      }
      onClose();
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
