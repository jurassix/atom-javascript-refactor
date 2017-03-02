'use babel';

// @flow
import type { Store as ReduxStore } from 'redux';

export type State = {
  refactorInProgress: boolean,
};

export type Action = {
  type: 'refactor-start',
} | {
  type: 'refactor-end',
};

export type Store = ReduxStore<State, Action>;
