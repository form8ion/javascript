import {fileTypes} from '@form8ion/core';
import {projectTypes} from '@form8ion/javascript-core';
import {write as writeConfigFile} from '@form8ion/config-file';

import {describe, vi, it, expect, afterEach} from 'vitest';
import any from '@travi/any';

import scaffoldRemark from './scaffolder.js';

vi.mock('@form8ion/config-file');

describe('remark scaffolder', () => {
  const config = any.string();
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should write the config and define dependencies', async () => {
    expect(await scaffoldRemark({config, projectRoot, vcs: any.simpleObject()}))
      .toEqual({
        devDependencies: [config, 'remark-cli', 'remark-toc'],
        scripts: {
          'lint:md': 'remark . --frail',
          'generate:md': 'remark . --output'
        }
      });
    expect(writeConfigFile).toHaveBeenCalledWith({
      format: fileTypes.JSON,
      path: projectRoot,
      name: 'remark',
      config: {
        settings: {
          listItemIndent: 1,
          emphasis: '_',
          strong: '_',
          bullet: '*',
          incrementListMarker: false
        },
        plugins: [
          config,
          ['remark-toc', {tight: true}]
        ]
      }
    });

    it('should configure the remark-usage plugin for package projects', async () => {
      expect(await scaffoldRemark({config, projectRoot, projectType: projectTypes.PACKAGE, vcs: any.simpleObject()}))
        .toEqual({
          devDependencies: [config, 'remark-cli', 'remark-toc', 'remark-usage'],
          scripts: {
            'lint:md': 'remark . --frail',
            'generate:md': 'remark . --output'
          }
        });
      expect(writeConfigFile).toHaveBeenCalledWith({
        format: fileTypes.JSON,
        path: projectRoot,
        name: 'remark',
        config: {
          settings: {
            listItemIndent: 1,
            emphasis: '_',
            strong: '_',
            bullet: '*',
            incrementListMarker: false
          },
          plugins: [
            config,
            ['remark-toc', {tight: true}],
            ['remark-usage', {heading: 'example'}]
          ]
        }
      });
    });

    it('should configure validate-links when the project will not be versioned', async () => {
      await scaffoldRemark({config, projectRoot, vcs: undefined});

      expect(writeConfigFile).toHaveBeenCalledWith({
        format: fileTypes.JSON,
        path: projectRoot,
        name: 'remark',
        config: {
          settings: {
            listItemIndent: 1,
            emphasis: '_',
            strong: '_',
            bullet: '*',
            incrementListMarker: false
          },
          plugins: [
            config,
            ['remark-toc', {tight: true}],
            ['validate-links', {repository: false}]
          ]
        }
      });
    });
  });
});
