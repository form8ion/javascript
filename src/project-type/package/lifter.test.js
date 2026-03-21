import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {lift as liftPublishable} from '../publishable/index.js';
import lift from './lifter.js';

vi.mock('../publishable/lifter');

describe('package project-type lifter', () => {
  it('should leverage the publishable lifter', async () => {
    const projectRoot = any.string();
    const packageDetails = any.simpleObject();
    const configs = any.simpleObject();
    const publishableResults = any.simpleObject();
    when(liftPublishable).calledWith({projectRoot, packageDetails, configs}).thenResolve(publishableResults);

    expect(await lift({projectRoot, packageDetails, configs})).toEqual(publishableResults);
  });
});
