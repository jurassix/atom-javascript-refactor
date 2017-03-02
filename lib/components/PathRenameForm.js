'use babel';

// @flow
import { CompositeDisposable } from 'atom'; // eslint-disable-line import/no-extraneous-dependencies
import React from 'react-for-atom';
import AtomInput from './AtomInput';

type Props = {
  previousPath: string,
  onClose: Function,
  onRename: Function,
}

export default class PathRenameForm extends React.Component {
  atomInput: AtomInput;
  disposables: CompositeDisposable;
  props: Props;
  root: HTMLDivElement;
  state: {
    path: string,
  }

  constructor(props: Props) {
    super(props);
    this.disposables = new CompositeDisposable();
    this.state = {
      path: props.previousPath,
    };
  }

  componentDidMount() {
    this.disposables.add(
      atom.commands.add(
        this.root, {
          'core:confirm': () => this.props.onRename({
            previousPath: this.props.previousPath,
            nextPath: this.state.path,
          }),
          'core:cancel': () => this.props.onClose(),
        },
      ),
    );
    this.atomInput.focus();
  }

  onChange = (path: string) => {
    this.setState({ path });
  }

  render() {
    return (
      <div ref={(ref) => { this.root = ref; }} className="atom-javascript-refactor">
        <label
          className="icon icon-arrow-right"
          htmlFor="atom-javascript-refactor-path-rename-input"
        >
          Enter the new path for the file.
        </label>
        <AtomInput
          id="atom-javascript-refactor-path-rename-input"
          ref={(ref) => { this.atomInput = ref; }}
          initialValue={this.state.path}
          onClose={this.props.onClose}
          onBlur={this.props.onClose}
          onDidChange={this.onChange}
        />
      </div>
    );
  }
}
