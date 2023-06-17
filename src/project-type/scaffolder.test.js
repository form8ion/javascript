import {projectTypes} from '@form8ion/javascript-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as packageTypeScaffolder} from './package';
import * as applicationTypeScaffolder from './application';
import * as monorepoTypeScaffolder from './monorepo';
import {scaffold as cliTypeScaffolder} from './cli';
import projectTypeScaffolder from './scaffolder';

vi.mock('./package/scaffolder');
vi.mock('./application');
vi.mock('./cli');
vi.mock('./monorepo');

describe('project-type scaffolder', () => {
  const results = any.simpleObject();
  const projectRoot = any.string();
  const projectName = any.word();
  const packageName = any.word();
  const packageManager = any.word();
  const visibility = any.word();
  const decisions = any.simpleObject();
  const vcs = any.simpleObject();
  const publishRegistry = any.url();
  const dialect = any.word();
  const provideExample = any.boolean();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should apply the package-type scaffolder when the project-type is `Package`', async () => {
    const scope = any.word();
    const packageBundlers = any.simpleObject();
    when(packageTypeScaffolder).calledWith({
      projectRoot,
      packageName,
      projectName,
      packageManager,
      visibility,
      scope,
      packageBundlers,
      vcs,
      decisions,
      dialect,
      provideExample,
      publishRegistry
    }).mockResolvedValue(results);

    expect(await projectTypeScaffolder({
      projectType: projectTypes.PACKAGE,
      projectRoot,
      projectName,
      packageName,
      packageManager,
      visibility,
      scope,
      packageBundlers,
      vcs,
      decisions,
      dialect,
      provideExample,
      publishRegistry
    })).toEqual(results);
  });

  it('should apply the application-type scaffolder when the project-type is `Application`', async () => {
    when(applicationTypeScaffolder.default).calledWith({projectRoot}).mockResolvedValue(results);

    expect(await projectTypeScaffolder({
      projectType: projectTypes.APPLICATION,
      projectRoot,
      projectName,
      packageName,
      packageManager,
      decisions,
      visibility,
      vcs
    })).toEqual(results);
  });

  it('should apply the cli-type scaffolder when the project-type is `CLI`', async () => {
    when(cliTypeScaffolder)
      .calledWith({packageName, visibility, projectRoot, dialect, publishRegistry})
      .mockResolvedValue(results);

    expect(await projectTypeScaffolder({
      projectType: projectTypes.CLI,
      packageName,
      visibility,
      vcs,
      projectRoot,
      dialect,
      publishRegistry
    })).toEqual(results);
  });

  it('should apply the monorepo-type scaffolder when the project-type is `Monorepo`', async () => {
    when(monorepoTypeScaffolder.default).calledWith({projectRoot}).mockResolvedValue(results);

    expect(await projectTypeScaffolder({projectRoot, projectType: projectTypes.MONOREPO, packageManager, decisions}))
      .toEqual(results);
  });

  it('should not throw an error when the project-type is `Other`', async () => {
    expect(await projectTypeScaffolder({projectType: 'Other'})).toEqual({});
  });

  it('should throw an error for an unknown project-type', async () => {
    const projectType = any.word();

    await expect(() => projectTypeScaffolder({projectType}))
      .rejects.toThrowError(`The project-type of ${projectType} is invalid`);
  });
});
