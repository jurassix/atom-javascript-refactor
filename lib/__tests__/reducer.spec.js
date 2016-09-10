import reducer from '../reducer';

test('refactor-start', () => {
  const state = reducer(undefined, {
    type: 'refactor-start',
  });

  expect(state).toEqual({
    refactorInProgress: true,
  });
});

test('refactor-end', () => {
  const state = reducer(undefined, {
    type: 'refactor-end',
  });

  expect(state).toEqual({
    refactorInProgress: false,
  });
});

test('unknown action type', () => {
  const initialState = {
    refactorInProgress: false,
  };
  const state = reducer(initialState, {
    type: 'some-unknown-type',
  });

  expect(initialState).toBe(state);
});
