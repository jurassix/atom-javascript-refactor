'use babel';
// @flow
import {
  React,
  ReactDOM,
} from 'react-for-atom';
import { autobind } from 'core-decorators';
import StatusBarTileComponent from './components/StatusBarTileComponent';

@autobind
export default class StatusBarTile {
  store: redux$Store;
  unsubscribe: Function;
  node: ?HTMLDivElement;
  tile: ?atom$StatusBarTile;

  constructor(reduxStore: redux$Store) {
    this.store = reduxStore;
    this.unsubscribe = this.store.subscribe(this.render);
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
