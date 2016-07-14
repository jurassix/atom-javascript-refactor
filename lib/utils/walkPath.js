'use babel';

import { join } from 'path';
import { readdirSync } from 'fs-plus';
import isDirectory from './isDirectory';

function makeAbsolute({ root, paths }) {
  return paths.map((path) => join(root, path));
}

export default function walkPath(...paths) {
  const accumulator = [];
  paths.forEach((path) => {
    if (isDirectory(path)) {
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
