import {scaffoldChoice} from '@form8ion/javascript-core';

import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import chooseFramework from './prompt.js';
import scaffoldIntegrationTesting from './scaffolder.js';

vi.mock('@form8ion/javascript-core');
vi.mock('./prompt.js');

describe('integration testing scaffolder', () => {
  it('should scaffold the chosen framework', async () => {
    const projectRoot = any.string();
    const dialect = any.word();
    const chosenFramework = any.word();
    const integrationTestFrameworks = any.simpleObject();
    const integrationTestFrameworkResults = any.simpleObject();
    const prompt = vi.fn();
    when(chooseFramework).calledWith({frameworks: integrationTestFrameworks, prompt}).thenResolve(chosenFramework);
    when(scaffoldChoice)
      .calledWith(integrationTestFrameworks, chosenFramework, {projectRoot, dialect})
      .thenResolve(integrationTestFrameworkResults);

    expect(await scaffoldIntegrationTesting({projectRoot, frameworks: integrationTestFrameworks, dialect}, {prompt}))
      .toEqual(integrationTestFrameworkResults);
  });
});
