'use babel';

import { join } from 'path';
import { readdirSync, statSync } from 'fs-plus';

/*
  adapted from:
  http://stackoverflow.com/a/24594123/1723135
*/

export default function getDirectoriesSync(dir) {
  return readdirSync(dir)
    .map((filename) => join(dir, filename))
    .filter((filePath) => {
      try {
        return statSync(filePath).isDirectory();
      } catch (e) {
        return false;
      }
    });
}
