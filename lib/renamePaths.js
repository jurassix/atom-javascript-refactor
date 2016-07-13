'use babel';

import { extname, join } from 'path';
import {
  fileExists,
  getDirectoriesSync,
  getRepo,
  getUserOptions,
  isDirectory,
  renameFile,
  walkPath,
} from './utils';
import importDeclarationCodemodRunner from './transforms/importDeclarationCodemodRunner';
import importRelativeCodemodRunner from './transforms/importRelativeCodemodRunner';

async function renameAndTransform(previousPath, nextPath, projectRoot, userOptions) {
  if (fileExists(nextPath)) {
    atom.notifications.addError(`${nextPath} already exists!`, {
      dismissable: true,
    });
    return;
  }

  if (renameFile(previousPath, nextPath)) {
    if (extname(previousPath) === '.js' && extname(nextPath) === '.js') {
      await importRelativeCodemodRunner(
        nextPath,
        previousPath,
        nextPath,
        userOptions
      );

      await importDeclarationCodemodRunner(
        projectRoot,
        previousPath,
        nextPath,
        userOptions
      );
    }
  }
}

function syncChangesWithGit(projectRoot) {
  const repo = getRepo(projectRoot);
  if (repo !== null) {
    getDirectoriesSync(projectRoot).forEach((filePath) =>
      repo.getDirectoryStatus(filePath)
    );
    atom.workspace.getTextEditors().forEach((editor) =>
      repo.getPathStatus(editor.getPath())
    );
  }
}

export default async function renamePaths({ previousPath, nextPath, showLoader }) {
  showLoader();

  const [projectRoot] = atom.project.relativizePath(previousPath);
  const userOptions = getUserOptions(projectRoot);

  if (isDirectory(previousPath)) {
    for (const path of walkPath(previousPath)) {
      if (path.startsWith(previousPath)) {
        const renamePath = join(nextPath, path.slice(previousPath.length));
        await renameAndTransform(path, renamePath, projectRoot, userOptions);
      }
    }
  } else {
    await renameAndTransform(previousPath, nextPath, projectRoot, userOptions);
  }

  syncChangesWithGit(projectRoot);

  showLoader(false);
}
