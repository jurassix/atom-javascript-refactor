'use babel';

import { extname, join } from 'path';
import { isDirectorySync, isFileSync } from 'fs-plus';
import {
  getRepo,
  getUserOptions,
  renameFile,
  walkPath,
} from './utils';
import importDeclarationCodemodRunner from './transforms/importDeclarationCodemodRunner';
import importRelativeCodemodRunner from './transforms/importRelativeCodemodRunner';

async function renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions) {
  if (isFileSync(nextPath)) {
    atom.notifications.addError(`${nextPath} already exists!`, {
      dismissable: true,
    });
    return;
  }

  if (renameFile(previousPath, nextPath)) {
    if (
      isDirectorySync(nextPath) ||
      (extname(previousPath) === '.js' && extname(nextPath) === '.js')
    ) {
      const filesThatMoved = paths.map(path => path.nextFilePath);
      if (filesThatMoved.length > 0) {
        await importRelativeCodemodRunner(
          filesThatMoved,
          paths,
          userOptions
        );
      }

      await importDeclarationCodemodRunner(
        [projectRoot],
        paths,
        userOptions
      );
    }
  }
}

function syncChangesWithGit(projectRoot) {
  const repo = getRepo(projectRoot);
  if (repo !== null) {
    repo.refreshIndex();
    repo.refreshStatus();
    atom.workspace.getTextEditors().forEach(editor =>
      repo.getPathStatus(editor.getPath())
    );
  }
}

export default async function renamePaths(previousPath, nextPath) {
  const [projectRoot] = atom.project.relativizePath(previousPath);
  const userOptions = getUserOptions(projectRoot);
  const paths = [];

  if (isDirectorySync(previousPath)) {
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
    });
  }

  await renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions);
  syncChangesWithGit(projectRoot);
}
