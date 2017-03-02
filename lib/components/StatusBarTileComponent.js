'use babel';

// @flow
import { React } from 'react-for-atom';

type Props = {
  refactorInProgress: boolean
}

export default function StatusBarIndicator({ refactorInProgress }: Props) {
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
        />
        <span>Refactor in progress&hellip;</span>
      </div>
    );
  }

  return null;
}
