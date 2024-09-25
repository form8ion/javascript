import {scaffoldChoice} from '@form8ion/javascript-core';

import any from '@travi/any';
import {when} from 'jest-when';
import {describe, expect, it, vi} from 'vitest';

import chooseProjectTypePlugin from './prompt.js';
import scaffold from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./prompt.js');

describe('chosen project-type plugin scaffolder', () => {
  const chosenType = any.word();
  const projectRoot = any.string();
  const packageManager = any.word();
  const projectName = any.word();
  const packageName = any.word();
  const projectType = any.word();
  const scope = any.word();
  const tests = any.simpleObject();
  const decisions = any.simpleObject();

  it('should enable choosing a plugin and scaffolding the choice', async () => {
    const typeScaffoldingResults = any.simpleObject();
    const pluginsForProjectType = any.simpleObject();
    const dialect = any.word();
    const plugins = {...any.simpleObject(), [projectType]: pluginsForProjectType};
    when(chooseProjectTypePlugin)
      .calledWith({types: pluginsForProjectType, decisions, projectType})
      .mockReturnValue(chosenType);
    when(scaffoldChoice)
      .calledWith(
        pluginsForProjectType,
        chosenType,
        {projectRoot, packageManager, projectName, packageName, tests, scope, dialect}
      )
      .mockResolvedValue(typeScaffoldingResults);

    expect(await scaffold({
      projectRoot,
      projectType,
      projectName,
      packageName,
      packageManager,
      tests,
      scope,
      dialect,
      decisions,
      plugins
    })).toEqual(typeScaffoldingResults);
  });

  it('should not scaffold a plugin if none are defined for the project type', async () => {
    const results = await scaffold({
      projectRoot,
      projectType,
      projectName,
      packageName,
      packageManager,
      tests,
      scope,
      decisions,
      plugins: any.simpleObject()
    });

    expect(chooseProjectTypePlugin).not.toHaveBeenCalled();
    expect(results).toEqual({});
  });
});
