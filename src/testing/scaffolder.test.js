import deepmerge from 'deepmerge';

import any from '@travi/any';
import {it, expect, describe, vi, beforeEach} from 'vitest';
import {when} from 'vitest-when';

import {scaffold as scaffoldUnitTesting} from './unit/index.js';
import {scaffold as scaffoldIntegrationTesting} from './integration/index.js';
import scaffoldTesting from './scaffolder.js';

vi.mock('deepmerge');
vi.mock('./unit/index.js');
vi.mock('./integration/index.js');

describe('testing scaffolder', () => {
  const projectRoot = any.string();
  const dialect = any.word();
  const unitTestFrameworks = any.simpleObject();
  const integrationTestFrameworks = any.simpleObject();
  const decisions = any.simpleObject();
  const unitTestScaffoldResults = any.simpleObject();
  const integrationTestScaffoldResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  beforeEach(() => {
    when(scaffoldUnitTesting)
      .calledWith({projectRoot, frameworks: unitTestFrameworks, decisions, dialect})
      .thenResolve(unitTestScaffoldResults);
    when(scaffoldIntegrationTesting)
      .calledWith({projectRoot, frameworks: integrationTestFrameworks, decisions, dialect})
      .thenResolve(integrationTestScaffoldResults);
  });

  it('should scaffold unit testing if the project will be unit test', async () => {
    when(deepmerge.all)
      .calledWith([
        {dependencies: {javascript: {development: ['@travi/any']}}, eslint: {}},
        unitTestScaffoldResults,
        {}
      ])
      .thenReturn(mergedResults);

    expect(await scaffoldTesting({
      projectRoot,
      tests: {unit: true, integration: false},
      unitTestFrameworks,
      integrationTestFrameworks,
      decisions,
      dialect
    })).toEqual(mergedResults);
  });

  it('should scaffold integration testing if the project will be integration tested', async () => {
    when(deepmerge.all)
      .calledWith([
        {dependencies: {javascript: {development: ['@travi/any']}}, eslint: {}},
        {},
        integrationTestScaffoldResults
      ])
      .thenReturn(mergedResults);

    expect(await scaffoldTesting({
      projectRoot,
      tests: {unit: false, integration: true},
      unitTestFrameworks,
      integrationTestFrameworks,
      decisions,
      dialect
    })).toEqual(mergedResults);
  });

  it('should scaffold both unit testing and integration testing if both layers are planned', async () => {
    when(deepmerge.all)
      .calledWith([
        {dependencies: {javascript: {development: ['@travi/any']}}, eslint: {}},
        unitTestScaffoldResults,
        integrationTestScaffoldResults
      ])
      .thenReturn(mergedResults);

    expect(await scaffoldTesting({
      projectRoot,
      tests: {unit: true, integration: true},
      unitTestFrameworks,
      integrationTestFrameworks,
      decisions,
      dialect
    })).toEqual(mergedResults);
  });

  it('should not scaffold testing if the project will not be tested', async () => {
    when(deepmerge.all)
      .calledWith([{dependencies: {javascript: {development: []}}, eslint: {}}, {}, {}])
      .thenReturn(mergedResults);

    expect(await scaffoldTesting({projectRoot, tests: {unit: false, integration: false}}))
      .toEqual(mergedResults);
  });
});
