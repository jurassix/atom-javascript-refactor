'use babel';

import { sep } from 'path';

/*
  adapted from:
  https://github.com/atom/tree-view/blob/5ffd11bb0d5e80a29bd073bba687ef92452af94e/lib/helpers.coffee
*/

export default function repoForPath(goalPath) {
  return atom.project.getPaths().reduce((repo, projectPath, i) => {
    if ((goalPath === projectPath) || (goalPath.indexOf(`${projectPath}${sep}`) === 0)) {
      /* eslint-disable no-param-reassign */
      repo = atom.project.getRepositories()[i];
    }
    return repo;
  }, null);
}
