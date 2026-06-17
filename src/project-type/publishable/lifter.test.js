import deepmerge from 'deepmerge';
import {mergeIntoExistingPackageJson} from '@form8ion/javascript-core';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import resolveRegistry from './registry-resolver.js';
import {lift as liftProvenance} from './provenance/index.js';
import lift from './lifter.js';

vi.mock('deepmerge');
vi.mock('@form8ion/javascript-core');
vi.mock('./provenance');
vi.mock('./badges');
vi.mock('./registry-resolver.js');

describe('publishable project-type lifter', () => {
  const projectRoot = any.string();
  const packageName = any.word();
  const packageAccessLevel = any.word();
  const packageDetails = {...any.simpleObject(), name: packageName, publishConfig: {access: packageAccessLevel}};
  const registries = any.simpleObject();
  const customRegistry = any.url();
  const provenanceResults = any.simpleObject();
  const mergedResults = any.simpleObject();

  beforeEach(() => {
    when(resolveRegistry).calledWith(packageName, registries).thenReturn(customRegistry);
    when(liftProvenance).calledWith({packageDetails, projectRoot, customRegistry}).thenResolve(provenanceResults);
  });

  it('should lift the details of the publishable project', async () => {
    const registryPage = `https://www.npmjs.com/package/${packageName}`;
    when(deepmerge).calledWith(
      provenanceResults,
      {
        scripts: {'lint:publish': 'publint --strict'},
        dependencies: {javascript: {development: ['publint']}},
        homepage: registryPage
      }
    ).thenReturn(mergedResults);

    expect(await lift({projectRoot, packageDetails, configs: {registries}})).toEqual(mergedResults);
    expect(mergeIntoExistingPackageJson).toHaveBeenCalledWith({projectRoot, config: {homepage: registryPage}});
  });

  it('should set the homepage based on the registry-specific package-details page', async () => {
    const packageDetailsPage = any.url();
    when(deepmerge).calledWith(
      provenanceResults,
      {
        scripts: {'lint:publish': 'publint --strict'},
        dependencies: {javascript: {development: ['publint']}},
        homepage: packageDetailsPage
      }
    ).thenReturn(mergedResults);

    expect(await lift({
      projectRoot,
      packageDetails,
      configs: {registries},
      npmRegistry: {packageDetailsPage}
    })).toEqual(mergedResults);
  });
});
