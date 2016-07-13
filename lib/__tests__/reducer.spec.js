import test from 'ava';
import reducer from '../reducer';

test('refactor-start', t => {
  const state = reducer(undefined, {
    type: 'refactor-start',
  });

  t.deepEqual(state, {
    refactorInProgress: true,
  });
});

test('refactor-end', t => {
  const state = reducer(undefined, {
    type: 'refactor-end',
  });

  t.deepEqual(state, {
    refactorInProgress: false,
  });
});

test('unknown action type', t => {
  const initialState = {
    refactorInProgress: false,
  };
  const state = reducer(initialState, {
    type: 'some-unknown-type',
  });

  t.true(initialState === state);
});
