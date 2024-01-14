import any from '@travi/any';
import {afterEach, vi, describe, expect, it} from 'vitest';
import {when} from 'jest-when';

import c8IsPresent from './c8/tester.js';
import nycIsPresent from './nyc/tester.js';
import coverageIsConfigured from './tester.js';

vi.mock('./c8/tester.js');
vi.mock('./nyc/tester.js');

describe('coverage predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` when nyc is detected', async () => {
    when(nycIsPresent).calledWith({projectRoot}).mockResolvedValue(true);

    expect(await coverageIsConfigured({projectRoot})).toBe(true);
  });

  it('should return `true` when c8 is detected', async () => {
    when(nycIsPresent).calledWith({projectRoot}).mockResolvedValue(false);
    when(c8IsPresent).calledWith({projectRoot}).mockResolvedValue(true);

    expect(await coverageIsConfigured({projectRoot})).toBe(true);
  });

  it('should return `false` when neither c8 nor nyc are detected', async () => {
    when(nycIsPresent).calledWith({projectRoot}).mockResolvedValue(false);
    when(c8IsPresent).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await coverageIsConfigured({projectRoot})).toBe(false);
  });
});
