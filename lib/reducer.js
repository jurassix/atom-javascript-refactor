'use babel';

// @flow

type State = {
  refactorInProgress: boolean,
};

const initialState = {
  refactorInProgress: false,
};

export default function reducer(state: State = initialState, action: redux$Action) {
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
