'use babel';

import { join } from 'fs-plus';
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

async function renameAndTransform(previousPath, nextPath, projectRoot, userOptions, showLoader) {
  if (renameFile(previousPath, nextPath)) {
    showLoader();

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

    showLoader(false);
  }
}

export default function renamePaths({ previousPath, nextPath, showLoader }) {
  if (fileExists(nextPath)) {
    atom.notifications.addError(`${nextPath} already exists!`, {
      dismissable: true,
    });
    return;
  }

  const [projectRoot] = atom.project.relativizePath(previousPath);
  const userOptions = getUserOptions(projectRoot);

  if (isDirectory(previousPath)) {
    walkPath(previousPath).forEach((path) => {
      if (path.startsWith(previousPath)) {
        const renamePath = join(nextPath, path.slice(previousPath.length));
        renameAndTransform(path, renamePath, projectRoot, userOptions, showLoader);
      }
    });
  } else {
    renameAndTransform(previousPath, nextPath, projectRoot, userOptions, showLoader);
  }

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
