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

async function renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions) {
  if (fileExists(nextPath)) {
    atom.notifications.addError(`${nextPath} already exists!`, {
      dismissable: true,
    });
    return;
  }

  if (renameFile(previousPath, nextPath)) {
    if (
      isDirectory(nextPath) ||
      (extname(previousPath) === '.js' && extname(nextPath) === '.js')
    ) {
      for (const path of paths) {
        const root = path.nextFilePath;
        await importRelativeCodemodRunner(
          root,
          path.prevFilePath,
          path.nextFilePath,
          userOptions
        );
      }

      await importDeclarationCodemodRunner(
        projectRoot,
        paths,
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
  const paths = [];

  if (isDirectory(previousPath)) {
    for (const path of walkPath(previousPath)) {
      if (path.startsWith(previousPath)) {
        const renamePath = join(nextPath, path.slice(previousPath.length));
        paths.push({
          prevFilePath: path,
          nextFilePath: renamePath,
        });
      }
    }
  } else {
    paths.push({
      prevFilePath: previousPath,
      nextFilePath: nextPath,
    })
  }

  await renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions);
  syncChangesWithGit(projectRoot);

  showLoader(false);
}
