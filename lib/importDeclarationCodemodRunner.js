import Runner from 'jscodeshift/dist/Runner';
const transform = require.resolve(
  'refactoring-codemods/lib/transformers/import-declaration-transform'
);

export default function importDeclarationCodemodRunner(
  path,
  prevFilePath,
  nextFilePath
) {
  Runner.run({
    transform,
    path,
    opts: {
      prevFilePath,
      nextFilePath,
    },
  });
}
