import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {lift as liftPublishable} from '../publishable/index.js';
import lift from './lifter.js';

vi.mock('../publishable/lifter');

describe('cli project-type lifter', () => {
  it('should leverage the publishable lifter', async () => {
    const projectRoot = any.string();
    const packageDetails = any.simpleObject();
    const registry = any.url();
    const publishableResults = any.simpleObject();
    when(liftPublishable).calledWith({projectRoot, packageDetails, registry}).thenResolve(publishableResults);

    expect(await lift({projectRoot, packageDetails, registry})).toEqual(publishableResults);
  });
});
