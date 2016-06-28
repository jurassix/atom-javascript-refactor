'use babel';

import AtomInput from './AtomInput';
import React from 'react-for-atom';

class PathRenameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: props.previousPath,
    };
  }

  render() {
    return (
      <div className="atom-refactoring-codemods">
        <label className="label">
          Enter the new path for the file.
        </label>
          <AtomInput
            ref="atomInput"
            initialValue={this.state.path}
            onClose={this.props.onClose}
            onBlur={this.props.onClose}
          />
      </div>
    );
  }

  focus() {
    this.refs.atomInput.focus();
  }
}

PathRenameForm.propTypes = {
  previousPath: React.PropTypes.string,
  onClose: React.PropTypes.func,
};

PathRenameForm.defaultProps = {
  previousPath: '',
  onClose: () => {},
};

export default PathRenameForm;
