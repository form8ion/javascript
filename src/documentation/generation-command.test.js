import {packageManagers} from '@form8ion/javascript-core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import buildCommand from './generation-command.js';

describe('documentation generation command', () => {
  it('should return the npm variation of the command', () => {
    expect(buildCommand(packageManagers.NPM)).toEqual('npm run generate:md');
  });

  it('should return the yarn variation of the command', () => {
    expect(buildCommand(packageManagers.YARN)).toEqual('yarn generate:md');
  });

  it('should throw an error for unsupported package managers', () => {
    const packageManager = any.word();

    expect(() => buildCommand(packageManager)).toThrowError(
      `The ${packageManager} package manager is currently not supported. `
      + `Only ${Object.values(packageManagers).join(' and ')} are currently supported.`
    );
  });
});
