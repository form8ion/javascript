import {promises as fs} from 'node:fs';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {lift, test as predicate} from './engines';

vi.mock('node:fs');

describe('engines enhancer', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('predicate', () => {
    it('should return `true` when `engines.node` is defined', async () => {
      when(fs.readFile)
        .calledWith(`${projectRoot}/package.json`, 'utf8')
        .mockResolvedValue(JSON.stringify({engines: {node: any.word()}}));

      expect(await predicate({projectRoot})).toBe(true);
    });

    it('should return `false` when `engines.node` is not defined', async () => {
      fs.readFile.mockReturnValue(JSON.stringify({engines: {}}));

      expect(await predicate({projectRoot})).toBe(false);
    });

    it('should return `false` when `engines` is not defined', async () => {
      fs.readFile.mockReturnValue(JSON.stringify({}));

      expect(await predicate({projectRoot})).toBe(false);
    });
  });

  describe('lifter', () => {
    it('should return the details for linting and communicating engines restrictions', async () => {
      const packageName = any.word();
      const packageDetails = {...any.simpleObject(), name: packageName};

      const {scripts, badges, devDependencies} = await lift({projectRoot, packageDetails});

      expect(scripts['lint:engines']).toEqual('ls-engines');
      expect(devDependencies).toEqual(['ls-engines']);
      expect(badges.consumer.node)
        .toEqual({img: `https://img.shields.io/node/v/${packageName}?logo=node.js`, text: 'node'});
    });
  });
});
