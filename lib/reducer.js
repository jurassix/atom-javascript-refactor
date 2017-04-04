'use babel';

// @flow
import type { State, Action } from './types';

const initialState = {
  refactorInProgress: false,
};

export default function reducer(state?: State = initialState, action: Action) {
  switch (action.type) {
    case 'refactor-start':
      return {
        ...state,
        refactorInProgress: true,
      };
    case 'refactor-end':
      return {
        ...state,
        refactorInProgress: false,
      };
    default:
      return state;
  }
}
