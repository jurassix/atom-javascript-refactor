'use babel';

import { join } from 'path';
import { isDirectorySync, readdirSync } from 'fs-plus';

function makeAbsolute({ root, paths }) {
  return paths.map(path => join(root, path));
}

export default function walkPath(...paths) {
  const accumulator = [];
  paths.forEach((path) => {
    if (isDirectorySync(path)) {
      const absolutePaths = makeAbsolute({
        root: path,
        paths: readdirSync(path),
      });
      accumulator.push(
        ...walkPath(...absolutePaths)
      );
    } else {
      accumulator.push(path);
    }
  });
  return accumulator;
}
