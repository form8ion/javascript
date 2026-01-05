import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import compareScriptNames from './script-comparator.js';

describe('script name comparator', () => {
  it('should consider undefined sort orders as equivalent', async () => {
    expect(compareScriptNames(any.word(), any.word())).toEqual(0);
  });

  it('should sort `pre` scripts ahead of their related scripts', async () => {
    const baseScriptName = any.word();
    expect(compareScriptNames(`pre${baseScriptName}`, baseScriptName)).toEqual(-1);
    expect(compareScriptNames(baseScriptName, `pre${baseScriptName}`)).toEqual(1);

    expect(compareScriptNames('pretest', 'test')).toEqual(-1);
    expect(compareScriptNames('test', 'pretest')).toEqual(1);
  });

  it('should sort the `test` script ahead of any sub-test scripts', async () => {
    expect(compareScriptNames('test', `test:${any.word()}`)).toEqual(-1);
    expect(compareScriptNames(`test:${any.word()}`, 'test')).toEqual(1);
  });

  it('should sort `lint:` scripts above `test:` scripts', async () => {
    expect(compareScriptNames(`lint:${any.word()}`, `test:${any.word()}`)).toEqual(-1);
    expect(compareScriptNames(`test:${any.word()}`, `lint:${any.word()}`)).toEqual(1);
  });
});
