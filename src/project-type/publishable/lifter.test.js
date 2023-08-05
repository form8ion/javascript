import deepmerge from 'deepmerge';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {lift as liftProvenance} from './provenance';
import lift from './lifter';

vi.mock('deepmerge');
vi.mock('./provenance');

describe('publishable project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the details of the package project', async () => {
    const projectRoot = any.string();
    const packageDetails = any.simpleObject();
    const provenanceResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    when(liftProvenance).calledWith({packageDetails, projectRoot}).mockResolvedValue(provenanceResults);
    when(deepmerge).calledWith(
      provenanceResults,
      {scripts: {'lint:publish': 'publint --strict'}, devDependencies: ['publint']}
    ).mockReturnValue(mergedResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(mergedResults);
  });
});
