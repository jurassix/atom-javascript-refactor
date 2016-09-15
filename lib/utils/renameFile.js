'use babel';

import { isFileSync, moveSync, statSync } from 'fs-plus';

/*
  code pulled from:
  https://github.com/atom/tree-view/blob/492e344149bd42755d90765607743173bb9b7c0a/lib/move-dialog.coffee
*/

function isNewPathValid(previousPath, nextPath) {
  if (!isFileSync(nextPath)) return true;

  /*
  New path exists so check if it points to the same file as the initial
  path to see if the case of the file name is being changed on a on a
  case insensitive filesystem.
  */
  const oldStat = statSync(previousPath);
  const newStat = statSync(nextPath);
  const haveSamePath = previousPath.toLowerCase() === nextPath.toLowerCase();
  const haveSameDev = oldStat.dev === newStat.dev;
  const haveSameIno = oldStat.ino === newStat.ino;

  return !(haveSamePath && haveSameDev && haveSameIno);
}

export default function renameFile(previousPath, nextPath) {
  if (!isNewPathValid(previousPath, nextPath)) return false;

  try {
    moveSync(previousPath, nextPath);
    return true;
  } catch (e) {
    atom.notifications.addError(e.message, {
      dismissable: true,
    });
    return false;
  }
}
