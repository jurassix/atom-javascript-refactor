'use babel';

// @flow

export type State = {
  refactorInProgress: boolean,
};

export type Action = {
  type: 'refactor-start',
} | {
  type: 'refactor-end',
};
