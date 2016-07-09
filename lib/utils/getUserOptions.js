'use babel';

import { resolve } from 'path';
import { statSync } from 'fs-plus';

const KEY_PATH = 'atom-refactoring-codemods';

export default function getUserOptions(projectRoot) {
  const [{ value: userOptions }] = atom.config.getAll(KEY_PATH);
  const ignoreConfig = userOptions.ignoreConfig.reduce((ignorePaths, config) => {
    const filePath = resolve(projectRoot, config);
    try {
      statSync(filePath);
      ignorePaths.push(filePath);
    } catch (e) { /* eslint-disable no-empty */ }
    return ignorePaths;
  }, []);
  const extensions = userOptions.extensions.join(',');
  return {
    ...userOptions,
    ignoreConfig,
    extensions,
  };
}
