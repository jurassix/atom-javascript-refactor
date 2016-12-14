'use babel';

import Runner from 'jscodeshift/dist/Runner';
import DEFAULT_OPTIONS from './constants';

const transform = require.resolve(
  'refactoring-codemods/lib/transformers/import-relative-transform',
);

export default function importDeclarationCodemodRunner(
  roots,
  paths,
  userOptions,
) {
  const options = {
    paths,
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const result = Runner.run(transform, roots, options);
  return Promise.resolve(result);
}
