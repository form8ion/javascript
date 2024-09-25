import any from '@travi/any';
import {describe, expect, it} from 'vitest';

import buildVcsIgnoreLists from './ignore-lists-builder.js';

describe('vcs-ignore lists builder', () => {
  const vcsIgnore = {files: any.listOf(any.word), directories: any.listOf(any.word)};

  it('should define the default lists', () => {
    expect(buildVcsIgnoreLists(vcsIgnore))
      .toEqual({files: vcsIgnore.files, directories: ['/node_modules/', ...vcsIgnore.directories]});
  });

  it('should default the file list to empty', () => {
    expect(buildVcsIgnoreLists({...vcsIgnore, files: undefined}).files).toEqual([]);
  });

  it('should default the directories list to contain `node_modules', () => {
    expect(buildVcsIgnoreLists({...vcsIgnore, directories: undefined}).directories).toEqual(['/node_modules/']);
  });

  it('should produce default lists when ignores are missing', () => {
    expect(buildVcsIgnoreLists()).toEqual({files: [], directories: ['/node_modules/']});
  });
});
