'use babel';

import Runner from 'jscodeshift/dist/Runner';
import { DEFAULT_OPTIONS } from './constants';

const transform = require.resolve(
  'refactoring-codemods/lib/transformers/import-declaration-transform'
);

export default function importDeclarationCodemodRunner(
  root,
  paths,
  userOptions
) {
  const options = {
    paths,
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const result = Runner.run(transform, [root], options);
  return Promise.resolve(result);
}
