'use babel';

import Runner from 'jscodeshift/dist/Runner';
import {DEFAULT_OPTIONS} from './constants';

const transform = require.resolve(
  'refactoring-codemods/lib/transformers/import-relative-transform'
);

export default function importDeclarationCodemodRunner(
  path,
  prevFilePath,
  nextFilePath,
  userOptions
) {
  const options = {
    prevFilePath,
    nextFilePath,
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const result = Runner.run(transform, [path], options);
  Promise.resolve(result);
}
