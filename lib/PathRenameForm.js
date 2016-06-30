'use babel';

import {CompositeDisposable} from 'atom';
import AtomInput from './AtomInput';
import React from 'react-for-atom';

class PathRenameForm extends React.Component {
  static propTypes = {
    previousPath: React.PropTypes.string,
    onClose: React.PropTypes.func,
    onRename: React.PropTypes.func,
  }

  static defaultProps = {
    previousPath: '',
    onClose: () => {},
    onRename: () => {},
  }

  constructor(props) {
    super(props);
    this._disposables = new CompositeDisposable();
    this.state = {
      path: props.previousPath,
    };
  }

  componentDidMount() {
    this._disposables.add(
      /* eslint-disable no-undef */
      atom.commands.add(
        this.refs.root, {
          'core:confirm': () => this.props.onRename({
            previousPath: this.props.previousPath,
            nextPath: this.state.path,
          }),
          'core:cancel': () => this.props.onClose(),
        }
      )
    );
    this.refs.atomInput.focus();
  }

  render() {
    return (
      <div ref="root" className="atom-refactoring-codemods">
        <label className="label">
          Enter the new path for the file.
        </label>
          <AtomInput
            ref="atomInput"
            initialValue={this.state.path}
            onClose={this.props.onClose}
            onBlur={this.props.onClose}
            onDidChange={this.onChange}
          />
      </div>
    );
  }

  onChange = (path) => {
    this.setState({path});
  }
}

export default PathRenameForm;
