'use babel';
import {React, ReactDOM} from 'react-for-atom';

class PathRenameForm extends React.Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.inputPath).focus();
  }
  render() {
    debugger;
    const {previousPath, onClose} = this.props;
    return (
      <div className="atom-refactoring-codemods">
        <label className="label">
          <input
            ref="inputPath"
            defaultValue={previousPath}
            onBlur={onClose}
          />
        </label>
      </div>
    );
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
