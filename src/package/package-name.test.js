import {EOL} from 'os';

import any from '@travi/any';
import {describe, it, expect, vi} from 'vitest';
import {when} from 'jest-when';

import validatePackageName from '../../thirdparty-wrappers/validate-npm-package-name.js';
import packageName from './package-name.js';

vi.mock('../../thirdparty-wrappers/validate-npm-package-name.js');

describe('package name', () => {
  const projectName = any.word();

  it('should return the project name if no scope is provided', () => {
    when(validatePackageName).calledWith(projectName).mockReturnValue({validForNewPackages: true});

    expect(packageName(projectName)).toEqual(projectName);
  });

  it('should include the scope in the name when provided', () => {
    const scope = any.word();
    const scopedName = `@${scope}/${projectName}`;
    when(validatePackageName).calledWith(scopedName).mockReturnValue({validForNewPackages: true});

    expect(packageName(projectName, scope)).toEqual(scopedName);
  });

  it('should throw and error when the value is not valid for npm', () => {
    const errors = any.listOf(any.sentence);
    when(validatePackageName).calledWith(projectName).mockReturnValue({validForNewPackages: false, errors});

    expect(() => packageName(projectName))
      .toThrowError(`The package name ${projectName} is invalid:${EOL}\t* ${errors.join(`${EOL}\t* `)}`);
  });

  it('should strip a leading dot from the package name', () => {
    when(validatePackageName)
      .calledWith(`.${projectName}`)
      .mockReturnValue({validForNewPackages: false, errors: ['name cannot start with a period']});

    expect(packageName(`.${projectName}`)).toEqual(projectName);
  });

  it('should throw an error if more validation erros than a leading dot exist', () => {
    const errors = [...any.listOf(any.sentence), 'name cannot start with a period'];
    when(validatePackageName).calledWith(projectName).mockReturnValue({validForNewPackages: false, errors});

    expect(() => packageName(projectName))
      .toThrowError(`The package name ${projectName} is invalid:${EOL}\t* ${errors.join(`${EOL}\t* `)}`);
  });
});
