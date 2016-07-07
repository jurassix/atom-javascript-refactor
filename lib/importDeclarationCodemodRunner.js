'use babel';

import Runner from 'jscodeshift/dist/Runner';
const transform = require.resolve(
  'refactoring-codemods/lib/transformers/import-declaration-transform'
);

const DEFAULT_OPTIONS = {
  printOptions: {
    trailingComma: true,
    quote: 'single',
  },
  'inline-single-expressions': true,
};

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
  console.log(options);
  Runner.run(transform, [path], options);
}
