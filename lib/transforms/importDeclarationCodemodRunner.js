'use babel';

import Runner from 'jscodeshift/dist/Runner';
import transform from 'refactoring-codemods/lib/transformers/import-declaration-transform';
import {DEFAULT_OPTIONS} from './constants';

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
  Runner
    .run(transform, [path], options)
    .catch((error) => {
      /* eslint-disable no-console */
      console.error(error);
    });
}
