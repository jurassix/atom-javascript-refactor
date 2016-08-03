'use babel';

import { resolve } from 'path';
import { isFileSync } from 'fs-plus';

const KEY_PATH = 'atom-javascript-refactor';

export default function getUserOptions(projectRoot) {
  const [{ value: userOptions }] = atom.config.getAll(KEY_PATH);
  const ignoreConfig = userOptions.ignoreConfig.reduce((ignorePaths, config) => {
    const filePath = resolve(projectRoot, config);
    if (isFileSync(filePath)) {
      ignorePaths.push(filePath);
    }
    return ignorePaths;
  }, []);
  const extensions = userOptions.extensions.join(',');
  return {
    ...userOptions,
    ignoreConfig,
    extensions,
  };
}
