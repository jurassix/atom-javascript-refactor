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
    importRelativeCodemodRunner(
      nextPath,
      previousPath,
      nextPath,
      userOptions
    ).then(() =>
      importDeclarationCodemodRunner(
        projectRoot,
        previousPath,
        nextPath,
        userOptions
      )
    ).then(() => {
      const repo = getRepo(projectRoot);
      if (repo !== null) {
        getDirectoriesSync(projectRoot).forEach((filePath) =>
          repo.getDirectoryStatus(filePath)
        );
        atom.workspace.getTextEditors().forEach((editor) =>
          repo.getPathStatus(editor.getPath())
        );
      }
      showLoader(false);
    });
  }
}

export default function renamePaths({ previousPath, nextPath, showLoader }) {
  const [projectRoot] = atom.project.relativizePath(previousPath);
  const userOptions = getUserOptions(projectRoot);
  if (fileExists(nextPath)) {
    atom.notifications.addError(`${nextPath} already exists!`, {
      dismissable: true,
    });
  } else if (isDirectory(previousPath)) {
    walkPath(previousPath).forEach(async (path) => {
      if (path.startsWith(previousPath)) {
        const renamePath = join(nextPath, path.slice(previousPath.length));
        await renameAndTransform(path, renamePath, projectRoot, userOptions, showLoader);
      }
    });
  } else {
    renameAndTransform(previousPath, nextPath, projectRoot, userOptions, showLoader);
  }
}
