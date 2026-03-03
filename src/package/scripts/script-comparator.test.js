import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import compareScriptNames from './script-comparator.js';

describe('script name comparator', () => {
  const A_AFTER_B = 1;
  const A_BEFORE_B = -1;
  const baseScriptName = any.word();

  it('should sort alphabetically if no other rules apply', async () => {
    const a = `a${any.word()}`;
    const b = `b${any.word()}`;

    expect(compareScriptNames(a, b)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(b, a)).toEqual(A_AFTER_B);
  });

  it('should sort `pre` scripts ahead of their related scripts', async () => {
    expect(compareScriptNames(`pre${baseScriptName}`, baseScriptName)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(baseScriptName, `pre${baseScriptName}`)).toEqual(A_AFTER_B);

    expect(compareScriptNames('pretest', 'test')).toEqual(A_BEFORE_B);
    expect(compareScriptNames('test', 'pretest')).toEqual(A_AFTER_B);
  });

  it('should sort `post` scripts after of their related scripts', async () => {
    expect(compareScriptNames(`post${baseScriptName}`, baseScriptName)).toEqual(A_AFTER_B);
    expect(compareScriptNames(baseScriptName, `post${baseScriptName}`)).toEqual(A_BEFORE_B);

    expect(compareScriptNames('posttest', 'test')).toEqual(A_AFTER_B);
    expect(compareScriptNames('test', 'posttest')).toEqual(A_BEFORE_B);
  });

  it('should sort the `test` script ahead of any sub-test scripts', async () => {
    expect(compareScriptNames('test', `test:${any.word()}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`test:${any.word()}`, 'test')).toEqual(A_AFTER_B);
  });

  it('should sort `lint:` scripts above `test:` scripts', async () => {
    expect(compareScriptNames(`lint:${any.word()}`, `test:${any.word()}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`test:${any.word()}`, `lint:${any.word()}`)).toEqual(A_AFTER_B);

    expect(compareScriptNames(`prelint:${any.word()}`, `test:${any.word()}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`test:${any.word()}`, `prelint:${any.word()}`)).toEqual(A_AFTER_B);

    expect(compareScriptNames(`lint:${any.word()}`, `pretest:${any.word()}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`pretest:${any.word()}`, `lint:${any.word()}`)).toEqual(A_AFTER_B);

    expect(compareScriptNames(`prelint:${any.word()}`, `pretest:${any.word()}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`pretest:${any.word()}`, `prelint:${any.word()}`)).toEqual(A_AFTER_B);
  });

  it('should sort subscripts alphabetically', async () => {
    const a = `a${any.word()}`;
    const b = `b${any.word()}`;

    expect(compareScriptNames(`lint:${a}`, `lint:${b}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`lint:${b}`, `lint:${a}`)).toEqual(A_AFTER_B);

    expect(compareScriptNames(`test:${a}`, `test:${b}`)).toEqual(A_BEFORE_B);
    expect(compareScriptNames(`test:${b}`, `test:${a}`)).toEqual(A_AFTER_B);
  });

  it('should sort undefined scripts below `lint:` scripts', async () => {
    expect(compareScriptNames(any.word(), `lint:${any.word()}`)).toEqual(A_AFTER_B);
    expect(compareScriptNames(`lint:${any.word()}`, any.word())).toEqual(A_BEFORE_B);
  });

  it('should sort `test:unit` ahead of `test:integration`', async () => {
    expect(compareScriptNames('test:unit', 'test:integration')).toEqual(A_BEFORE_B);
    expect(compareScriptNames('test:integration', 'test:unit')).toEqual(A_AFTER_B);
  });

  it('should sort uncategorized scripts below `test:` scripts', async () => {
    expect(compareScriptNames(any.word(), `test:${any.word()}`)).toEqual(A_AFTER_B);
    expect(compareScriptNames(`test:${any.word()}`, any.word())).toEqual(A_BEFORE_B);
  });
});
