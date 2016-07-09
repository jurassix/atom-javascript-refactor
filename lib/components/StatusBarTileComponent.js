'use babel';

import { React } from 'react-for-atom';

const { PropTypes } = React;

export default function StatusBarIndicator({ refactorInProgress }) {
  if (refactorInProgress) {
    const iconStyle = {
      display: 'inline-block',
      marginRight: 4,
      verticalAlign: 'text-bottom',
    };

    return (
      <div>
        <span
          className="loading loading-spinner-tiny"
          style={iconStyle}
        ></span>
        <span>Refactor in progress&hellip;</span>
      </div>
    );
  }

  return null;
}

StatusBarIndicator.propTypes = {
  refactorInProgress: PropTypes.bool.isRequired,
};
