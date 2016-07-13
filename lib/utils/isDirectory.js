'use babel';

import { statSync } from 'fs-plus';

export default function isDirectory(filePath) {
  try {
    return statSync(filePath).isDirectory();
  } catch (e) {
    return false;
  }
}
