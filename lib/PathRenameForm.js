'use babel';
import {React, Component, ReactDOM, PropTypes} from 'react-for-atom';

class PathRenameForm extends Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.inputPath).focus();
  }
  render() {
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
  previousPath: PropTypes.string,
  onClose: PropTypes.func,
};

PathRenameForm.defaultProps = {
  previousPath: '',
  onClose: () => {},
};

export default PathRenameForm;
