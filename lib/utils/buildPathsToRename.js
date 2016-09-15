'use babel';
// @flow

import { join } from 'path';
import { isDirectorySync, listTreeSync } from 'fs-plus';

export default function buildPathsToRename(previousPath: string, nextPath: string) {
  if (isDirectorySync(previousPath)) {
    return listTreeSync(previousPath).map(prevFilePath => ({
      prevFilePath,
      nextFilePath: join(nextPath, prevFilePath.slice(previousPath.length)),
    }));
  }

  return [{
    prevFilePath: previousPath,
    nextFilePath: nextPath,
  }];
}
