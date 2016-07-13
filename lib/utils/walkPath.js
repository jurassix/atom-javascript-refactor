'use babel';

import { readdirSync, join } from 'fs-plus';
import isDirectory from './isDirectory';

function makeAbsolute({ root, paths }) {
  return paths.forEach((path) => join(root, path));
}

export default function walkPath(...paths) {
  const accumulator = [];
  paths.forEach((path) => {
    if (isDirectory(path)) {
      const absolutePaths = makeAbsolute({
        root: path,
        paths: readdirSync(path),
      });
      accumulator.concat(
        walkPath.apply(this, absolutePaths)
      );
    }
    accumulator.push(path);
  });
  return accumulator;
}
