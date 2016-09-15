import { isDirectorySync, listTreeSync } from 'fs-plus';
import buildPathsToRename from '../buildPathsToRename';

jest.mock('fs-plus');

describe('buildPathsToRename', () => {
  it('should build paths to rename when a file is being renamed', () => {
    const previousPath = '/projects/atom-javascript-refactor/myfile1.js';
    const nextPath = '/projects/atom-javascript-refactor/myfile2.js';

    isDirectorySync.mockReturnValueOnce(false);

    const actual = buildPathsToRename(previousPath, nextPath);
    const expected = [{
      prevFilePath: '/projects/atom-javascript-refactor/myfile1.js',
      nextFilePath: '/projects/atom-javascript-refactor/myfile2.js',
    }];

    expect(actual).toEqual(expected);
  });

  it('should build paths to rename when a directory is being renamed', () => {
    const previousPath = '/projects/atom-javascript-refactor/mydir1';
    const nextPath = '/projects/atom-javascript-refactor/mydir2';

    isDirectorySync.mockReturnValueOnce(true);
    listTreeSync.mockReturnValueOnce([
      '/projects/atom-javascript-refactor/mydir1/child.js',
      '/projects/atom-javascript-refactor/mydir1/mysubdir1/grandchild.js',
    ]);

    const actual = buildPathsToRename(previousPath, nextPath);
    const expected = [{
      prevFilePath: '/projects/atom-javascript-refactor/mydir1/child.js',
      nextFilePath: '/projects/atom-javascript-refactor/mydir2/child.js',
    }, {
      prevFilePath: '/projects/atom-javascript-refactor/mydir1/mysubdir1/grandchild.js',
      nextFilePath: '/projects/atom-javascript-refactor/mydir2/mysubdir1/grandchild.js',
    }];

    expect(actual).toEqual(expected);
  });
});
