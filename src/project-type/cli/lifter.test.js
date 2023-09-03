import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {lift as liftPublishable} from '../publishable';
import lift from './lifter';

vi.mock('../publishable/lifter');

describe('cli project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should leverage the publishable lifter', async () => {
    const projectRoot = any.string();
    const packageDetails = any.simpleObject();
    const publishableResults = any.simpleObject();
    when(liftPublishable).calledWith({projectRoot, packageDetails}).mockResolvedValue(publishableResults);

    expect(await lift({projectRoot, packageDetails})).toEqual(publishableResults);
  });
});
