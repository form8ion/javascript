import {execa} from 'execa';

import {it, expect, describe, afterEach, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {determineLatestVersionOf, install} from './tasks.js';

vi.mock('execa');

describe('node-version tasks', () => {
  const majorVersion = any.integer();
  const version = `v${majorVersion}.${any.integer()}.${any.integer()}`;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the latest node version when latest is requested', async () => {
    when(execa)
      .calledWith('. ~/.nvm/nvm.sh && nvm ls-remote', {shell: true})
      .mockResolvedValue({stdout: [...any.listOf(any.word), version, ''].join('\n')});

    expect(await determineLatestVersionOf(any.word())).toEqual(`v${majorVersion}`);
  });

  it('should return the latest LTS node version when LTS is requested', async () => {
    when(execa)
      .calledWith('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true})
      .mockResolvedValue({stdout: [...any.listOf(any.word), version, ''].join('\n')});

    expect(await determineLatestVersionOf('LTS')).toEqual(`v${majorVersion}`);
  });

  it('should install the node version', async () => {
    const pipe = vi.fn();
    when(execa).calledWith('. ~/.nvm/nvm.sh && nvm install', {shell: true}).mockReturnValue({stdout: {pipe}});

    await install();

    expect(pipe).toHaveBeenCalledWith(process.stdout);
  });
});
