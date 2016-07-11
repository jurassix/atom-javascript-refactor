'use babel';

import { statSync } from 'fs-plus';

export default function fileExists(filePath) {
  try {
    statSync(filePath);
  } catch (e) {
    if (e.code === 'ENOENT') return false;
  }
  return true;
}
