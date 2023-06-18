import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as liftPublishable from '../publishable/lifter';
import lift from './lifter';

vi.mock('../publishable/lifter');

describe('cli project-type lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should leverage the publishable lifter', async () => {
    const projectRoot = any.string();
    const publishableResults = any.simpleObject();
    when(liftPublishable.default).calledWith({projectRoot}).mockResolvedValue(publishableResults);

    expect(await lift({projectRoot})).toEqual(publishableResults);
  });
});
