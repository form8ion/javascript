import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffoldApplication from './scaffolder.js';

vi.mock('@form8ion/javascript-core');

describe('application project-type scaffolder', () => {
  const logger = {info: () => undefined};

  it('should scaffold the details specific to an application project-type', async () => {
    const projectRoot = any.string();
    const buildDirectory = 'public';

    expect(await scaffoldApplication({projectRoot}, {logger})).toEqual({
      scripts: {
        clean: `rimraf ./${buildDirectory}`,
        start: `node ./${buildDirectory}/index.js`,
        prebuild: 'run-s clean'
      },
      dependencies: {javascript: {development: ['rimraf']}},
      vcsIgnore: {
        files: ['.env'],
        directories: [`/${buildDirectory}/`]
      },
      buildDirectory,
      nextSteps: []
    });
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({projectRoot, config: {private: true}});
  });
});
