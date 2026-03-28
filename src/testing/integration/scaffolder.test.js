import {scaffoldChoice} from '@form8ion/javascript-core';

import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import prompt from './prompt.js';
import scaffoldIntegrationTesting from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./prompt.js');

describe('integration testing scaffolder', () => {
  it('should scaffold the chosen framework', async () => {
    const projectRoot = any.string();
    const decisions = any.simpleObject();
    const dialect = any.word();
    const chosenFramework = any.word();
    const integrationTestFrameworks = any.simpleObject();
    const integrationTestFrameworkResults = any.simpleObject();
    when(prompt).calledWith({frameworks: integrationTestFrameworks, decisions}).thenResolve(chosenFramework);
    when(scaffoldChoice)
      .calledWith(integrationTestFrameworks, chosenFramework, {projectRoot, dialect})
      .thenResolve(integrationTestFrameworkResults);

    expect(await scaffoldIntegrationTesting({projectRoot, frameworks: integrationTestFrameworks, decisions, dialect}))
      .toEqual(integrationTestFrameworkResults);
  });
});
