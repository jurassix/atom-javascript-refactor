'use babel';

import Runner from 'jscodeshift/dist/Runner';
import transform from 'refactoring-codemods/lib/transformers/import-relative-transform';
import { DEFAULT_OPTIONS } from './constants';


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
  return Promise.resolve(result);
}
