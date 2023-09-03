import deepmerge from 'deepmerge';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import defineBadges from './badges';
import {lift as liftProvenance} from './provenance';
import lift from './lifter';

vi.mock('deepmerge');
vi.mock('./provenance');
vi.mock('./badges');

describe('publishable project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the details of the package project', async () => {
    const projectRoot = any.string();
    const packageName = any.word();
    const packageAccessLevel = any.word();
    const packageDetails = {...any.simpleObject(), name: packageName, publishConfig: {access: packageAccessLevel}};
    const provenanceResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    const badgesResults = any.simpleObject();
    when(liftProvenance).calledWith({packageDetails, projectRoot}).mockResolvedValue(provenanceResults);
    when(defineBadges).calledWith(packageName, packageAccessLevel).mockReturnValue(badgesResults);
    when(deepmerge).calledWith(
      provenanceResults,
      {scripts: {'lint:publish': 'publint --strict'}, devDependencies: ['publint'], badges: badgesResults}
    ).mockReturnValue(mergedResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(mergedResults);
  });
});
