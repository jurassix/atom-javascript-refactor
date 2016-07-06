'use babel'
import {dirname} from 'path';
import {existsSync, makeTreeSync, moveSync, statSync} from 'fs-plus';

/*
  code pulled from:
  https://github.com/atom/tree-view/blob/492e344149bd42755d90765607743173bb9b7c0a/lib/move-dialog.coffee
*/

function isNewPathValid(previousPath, nextPath) {
  try {
    const oldStat = statSync(previousPath);
    const newStat = statSync(nextPath);

    /*
    New path exists so check if it points to the same file as the initial
    path to see if the case of the file name is being changed on a on a
    case insensitive filesystem.
    */
    const haveSamePath = previousPath.toLowerCase() === nextPath.toLowerCase();
    const haveSameDev = oldStat.dev === newStat.dev;
    const haveSameIno = oldStat.ino === newStat.ino;
    return haveSamePath && haveSameDev && haveSameIno;
  } catch(error) {
    console.error(error);
    // new path does not exist so it is valid
    return true;
  }
}

export default function renameFile(previousPath, nextPath) {
  if (previousPath === nextPath) return true;
  const directoryPath = dirname(nextPath);
  try {
    if (!existsSync(directoryPath)) {
      makeTreeSync(directoryPath);
    }
    moveSync(previousPath, nextPath);
    return true;
  } catch(error) {
    console.error(error);
    return false;
  }
}
