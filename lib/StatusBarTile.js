'use babel';

// @flow
import {
  React,
  ReactDOM,
} from 'react-for-atom';
import StatusBarTileComponent from './components/StatusBarTileComponent';
import type { Store } from './types';

export default class StatusBarTile {
  store: *;
  unsubscribe: *;
  node: ?HTMLDivElement;
  tile: ?atom$StatusBarTile;

  constructor(store: Store) {
    this.store = store;
    this.unsubscribe = this.store.subscribe(() => {
      this.render();
    });
  }

  dispose() {
    this.unsubscribe();

    if (this.tile) {
      this.tile.destroy();
      this.tile = null;
    }

    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node);
      this.node = null;
    }
  }

  consumeStatusBar(statusBar: atom$StatusBar) {
    const item = document.createElement('div');
    item.className = 'inline-block';
    this.node = item;

    this.tile = statusBar.addRightTile({
      item,
      priority: 1000,
    });

    this.render();
  }

  render() {
    const props = {
      refactorInProgress: this.store.getState().refactorInProgress,
    };

    ReactDOM.render(<StatusBarTileComponent {...props} />, this.node);
  }
}
