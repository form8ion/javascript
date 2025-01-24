import {promises as fs} from 'node:fs';
import {writePackageJson} from '@form8ion/javascript-core';

import {describe, it, expect, vi, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {process as processDependencies} from '../dependencies/index.js';
import {lift as liftScripts} from './scripts/index.js';
import defineVcsHostDetails from './vcs-host-details.js';
import sortPackageProperties from './property-sorter.js';
import liftPackage from './lifter.js';

vi.mock('node:fs');
vi.mock('@form8ion/javascript-core');
vi.mock('../dependencies/index.js');
vi.mock('./scripts/index.js');
vi.mock('./vcs-host-details.js');
vi.mock('./property-sorter.js');

describe('package.json lifter', () => {
  const projectRoot = any.string();
  const dependencies = any.simpleObject();
  const packageManager = any.word();
  const vcs = any.simpleObject();
  const pathWithinParent = any.string();
  const scripts = any.simpleObject();
  const existingScripts = any.simpleObject();
  const liftedScripts = any.simpleObject();
  const vcsDetails = any.simpleObject();
  const config = any.simpleObject();
  const tags = any.listOf(any.word);

  beforeEach(() => {
    when(defineVcsHostDetails).calledWith(vcs, pathWithinParent).mockReturnValue(vcsDetails);
    when(liftScripts).calledWith({existingScripts, scripts}).mockReturnValue(liftedScripts);
  });

  it('should update package.json properties and process dependencies', async () => {
    const existingPackageContents = {...any.simpleObject(), scripts: existingScripts};
    const devDependencies = any.listOf(any.word);
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(existingPackageContents));
    when(sortPackageProperties)
      .calledWith({...existingPackageContents, ...vcsDetails, scripts: liftedScripts})
      .mockReturnValue(config);

    await liftPackage({dependencies, devDependencies, projectRoot, packageManager, vcs, pathWithinParent, scripts});

    expect(writePackageJson).toHaveBeenCalledWith({projectRoot, config});
    expect(processDependencies).toHaveBeenCalledWith({dependencies, devDependencies, projectRoot, packageManager});
  });

  it('should update keywords if tags are provided', async () => {
    const existingPackageContents = {...any.simpleObject(), scripts: existingScripts};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(existingPackageContents));
    when(sortPackageProperties)
      .calledWith({...existingPackageContents, ...vcsDetails, scripts: liftedScripts, keywords: tags})
      .mockReturnValue(config);

    await liftPackage({dependencies, projectRoot, packageManager, vcs, pathWithinParent, scripts, tags});

    expect(writePackageJson).toHaveBeenCalledWith({projectRoot, config});
  });

  it('should append the provided tags to existing keywords', async () => {
    const existingKeywords = any.listOf(any.word);
    const existingPackageContents = {...any.simpleObject(), scripts: existingScripts, keywords: existingKeywords};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(existingPackageContents));
    when(sortPackageProperties)
      .calledWith({
        ...existingPackageContents,
        ...vcsDetails,
        scripts: liftedScripts,
        keywords: [...existingKeywords, ...tags]
      })
      .mockReturnValue(config);

    await liftPackage({dependencies, projectRoot, packageManager, vcs, pathWithinParent, scripts, tags});

    expect(writePackageJson).toHaveBeenCalledWith({projectRoot, config});
  });
});
