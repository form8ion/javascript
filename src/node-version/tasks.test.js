import {execa} from 'execa';

import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {determineLatestVersionOf, install} from './tasks.js';

vi.mock('execa');

describe('node-version tasks', () => {
  const majorVersion = any.integer();
  const version = `v${majorVersion}.${any.integer()}.${any.integer()}`;
  const logger = {info: () => undefined};

  it('should return the latest node version when latest is requested', async () => {
    when(execa)
      .calledWith('. ~/.nvm/nvm.sh && nvm ls-remote', {shell: true})
      .thenResolve({stdout: [...any.listOf(any.word), version, ''].join('\n')});

    expect(await determineLatestVersionOf(any.word(), {logger})).toEqual(`v${majorVersion}`);
  });

  it('should return the latest LTS node version when LTS is requested', async () => {
    when(execa)
      .calledWith('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true})
      .thenResolve({stdout: [...any.listOf(any.word), version, ''].join('\n')});

    expect(await determineLatestVersionOf('LTS', {logger})).toEqual(`v${majorVersion}`);
  });

  it('should install the node version', async () => {
    const pipe = vi.fn();
    when(execa).calledWith('. ~/.nvm/nvm.sh && nvm install', {shell: true}).thenReturn({stdout: {pipe}});

    await install(undefined, {logger});

    expect(pipe).toHaveBeenCalledWith(process.stdout);
  });
});
