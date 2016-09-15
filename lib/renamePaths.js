'use babel';
// @flow

import { extname } from 'path';
import { isDirectorySync, isFileSync } from 'fs-plus';
import {
  buildPathsToRename,
  getRepo,
  getUserOptions,
  renameFile,
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

export default async function renamePaths(previousPath: string, nextPath: string) {
  const [projectRoot] = atom.project.relativizePath(previousPath);
  const userOptions = getUserOptions(projectRoot);
  const paths = buildPathsToRename(previousPath, nextPath);

  await renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions);
  syncChangesWithGit(projectRoot);
}
