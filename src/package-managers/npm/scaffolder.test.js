import {promises as fs} from 'node:fs';
import {execa} from 'execa';
import {writePackageJson} from '@form8ion/javascript-core';

import any from '@travi/any';
import {vi, it, describe, expect} from 'vitest';
import {when} from 'vitest-when';

import scaffoldNpm from './scaffolder.js';

vi.mock('node:fs');
vi.mock('execa');
vi.mock('@form8ion/javascript-core');

describe('npm scaffolder', () => {
  const projectRoot = any.string();

  it('should scaffold the npm package manager', async () => {
    const existingPackageContents = any.simpleObject();
    const cliVersion = any.word();
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .thenResolve(JSON.stringify(existingPackageContents));
    when(execa).calledWith('npm', ['--version']).thenResolve({stdout: cliVersion});

    await scaffoldNpm({projectRoot});

    expect(writePackageJson).toHaveBeenCalledWith({
      projectRoot,
      config: {...existingPackageContents, packageManager: `npm@${cliVersion}`}
    });
  });
});
