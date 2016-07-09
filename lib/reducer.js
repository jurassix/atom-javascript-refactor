'use babel';

const initialState = {
  refactorInProgress: false,
};

export default function reducer(state = initialState, action) {
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
