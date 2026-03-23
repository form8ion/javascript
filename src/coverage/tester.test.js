import {directoryExists} from '@form8ion/core';
import {test as c8IsPresent} from '@form8ion/c8';

import any from '@travi/any';
import {afterEach, vi, describe, expect, it} from 'vitest';
import {when} from 'vitest-when';

import nycIsPresent from './nyc/tester.js';
import coverageIsConfigured from './tester.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/c8');
vi.mock('./nyc/tester.js');

describe('coverage predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `true` when nyc is detected', async () => {
    when(nycIsPresent).calledWith({projectRoot}).thenResolve(true);

    expect(await coverageIsConfigured({projectRoot})).toBe(true);
  });

  it('should return `true` when c8 is detected', async () => {
    when(nycIsPresent).calledWith({projectRoot}).thenResolve(false);
    when(c8IsPresent).calledWith({projectRoot}).thenResolve(true);

    expect(await coverageIsConfigured({projectRoot})).toBe(true);
  });

  it('should return `true` if the `coverage/` directory exists', async () => {
    when(nycIsPresent).calledWith({projectRoot}).thenResolve(false);
    when(c8IsPresent).calledWith({projectRoot}).thenResolve(false);
    when(directoryExists).calledWith(`${projectRoot}/coverage`).thenResolve(true);

    expect(await coverageIsConfigured({projectRoot})).toBe(true);
  });

  it('should return `false` when neither c8 nor nyc are detected', async () => {
    when(nycIsPresent).calledWith({projectRoot}).thenResolve(false);
    when(c8IsPresent).calledWith({projectRoot}).thenResolve(false);
    when(directoryExists).calledWith(`${projectRoot}/coverage`).thenResolve(false);

    expect(await coverageIsConfigured({projectRoot})).toBe(false);
  });
});
