'use babel';

import {
  React,
  ReactDOM,
} from 'react-for-atom';
import { autobind } from 'core-decorators';
import StatusBarTileComponent from './components/StatusBarTileComponent';

@autobind
export default class StatusBarTile {
  constructor(store) {
    this.store = store;
    this.unsubscribe = this.store.subscribe(this.render);
  }

  dispose() {
    this.unsubscribe();

    if (this.tile) {
      ReactDOM.unmountComponentAtNode(this.node);
      this.tile.destroy();
      this.tile = null;
      this.node = null;
    }
  }

  consumeStatusBar(statusBar) {
    const node = document.createElement('div');
    node.className = 'inline-block';
    this.node = node;

    this.tile = statusBar.addRightTile({
      item: node,
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
