import deepmerge from 'deepmerge';
import {projectTypes, scaffoldChoice} from '@form8ion/javascript-core';
import {scaffold as scaffoldCommitConvention} from '@form8ion/commit-convention';

import {it, vi, expect, describe, beforeEach} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {scaffold as scaffoldPackage} from '../package/index.js';
import {scaffold as scaffoldVerification} from './verification/index.js';
import {scaffold as scaffoldCodeStyle} from '../code-style/index.js';
import {scaffold as scaffoldDialect} from '../dialects/index.js';
import {scaffold as scaffoldNpmConfig} from '../npm-config/index.js';
import {scaffold as scaffoldNodeVersion} from '../node-version/index.js';
import {scaffold as scaffoldProjectTypePlugin} from '../project-type-plugin/index.js';
import buildVcsIgnoreLists from '../vcs/ignore-lists-builder.js';
import {scaffold as scaffoldProjectType} from '../project-type/index.js';
import buildDocumentationCommand from '../documentation/generation-command.js';
import scaffoldDocumentation from '../documentation/index.js';
import {validate} from '../options/validator.js';
import buildBadgesDetails from '../documentation/badges.js';
import {prompt} from '../prompts/questions.js';
import lift from '../lift/index.js';
import scaffold from './scaffolder.js';

vi.mock('deepmerge');
vi.mock('@form8ion/javascript-core');
vi.mock('@form8ion/commit-convention');
vi.mock('../package/index.js');
vi.mock('../code-style/index.js');
vi.mock('../dialects/index.js');
vi.mock('../npm-config/index.js');
vi.mock('../node-version/index.js');
vi.mock('../project-type-plugin/index.js');
vi.mock('../vcs/ignore-lists-builder.js');
vi.mock('../project-type/index.js');
vi.mock('../documentation/generation-command.js');
vi.mock('../documentation/index.js');
vi.mock('../options/validator.js');
vi.mock('../prompts/questions.js');
vi.mock('../documentation/badges.js');
vi.mock('../lift/index.js');
vi.mock('./verification/index.js');

describe('javascript project scaffolder', () => {
  const options = any.simpleObject();
  const projectRoot = any.string();
  const vcs = any.simpleObject();
  const pathWithinParent = any.string();
  const publishRegistry = any.url();
  const registries = {...any.simpleObject(), publish: publishRegistry};
  const configs = {...any.simpleObject(), registries};
  const packageManager = any.word();
  const visibility = any.word();
  const decisions = any.simpleObject();
  const documentationCommand = any.string();
  const documentation = any.string();
  const tags = any.listOf(any.word);
  const dialect = any.word();
  const provideExample = any.boolean();
  const scope = any.word();
  const scaffoldingResults = any.simpleObject();
  const vcsIgnore = any.simpleObject();
  const mergedVcsIgnore = any.simpleObject();
  const mergedNextSteps = any.listOf(any.simpleObject);
  const mergedResults = {...any.simpleObject(), vcsIgnore: mergedVcsIgnore, nextSteps: mergedNextSteps};

  beforeEach(() => {
    const projectName = any.word();
    const packageName = any.string();
    const description = any.sentence();
    const projectType = any.word();
    const ciChoice = any.word();
    const hostChoice = any.word();
    const license = any.word();
    const nodeVersionCategory = any.word();
    const author = any.simpleObject();
    const configureLinting = any.boolean();
    const tests = any.simpleObject();
    const ciServices = any.simpleObject();
    const hosts = any.simpleObject();
    const applicationTypes = any.simpleObject();
    const packageTypes = any.simpleObject();
    const monorepoTypes = any.simpleObject();
    const packageBundlers = any.simpleObject();
    const unitTestFrameworks = any.simpleObject();
    const testFilenamePattern = any.string();
    const buildDirectory = any.string();
    const packageResults = {...any.simpleObject(), packageName};
    const projectTypeResults = {...any.simpleObject(), tags, buildDirectory};
    const projectTypePluginResults = any.simpleObject();
    const nodeVersionResults = any.simpleObject();
    const ciServiceResults = any.simpleObject();
    const npmConfigResults = any.simpleObject();
    const dialectResults = any.simpleObject();
    const commitConventionResults = any.simpleObject();
    const codeStyleResults = any.simpleObject();
    const hostResults = any.simpleObject();
    const verificationResults = {...any.simpleObject(), testFilenamePattern};

    when(validate)
      .calledWith(options)
      .mockReturnValue({
        projectRoot,
        projectName,
        description,
        vcs,
        pathWithinParent,
        configs,
        visibility,
        license,
        decisions,
        plugins: {ciServices, hosts, applicationTypes, packageTypes, monorepoTypes, packageBundlers, unitTestFrameworks}
      });
    when(prompt)
      .calledWith(ciServices, hosts, visibility, vcs, decisions, configs, pathWithinParent)
      .mockResolvedValue({
        packageManager,
        dialect,
        scope,
        author,
        provideExample,
        projectType,
        tests,
        ci: ciChoice,
        chosenHost: hostChoice,
        nodeVersionCategory,
        configureLinting
      });
    when(scaffoldDocumentation).calledWith({packageManager, projectTypeResults}).mockReturnValue(documentation);
    when(buildDocumentationCommand).calledWith(packageManager).mockReturnValue(documentationCommand);
    when(scaffoldPackage)
      .calledWith({projectRoot, projectName, scope, dialect, license, author, description})
      .mockResolvedValue(packageResults);
    when(scaffoldProjectType)
      .calledWith({
        projectRoot,
        projectName,
        packageName,
        projectType,
        packageManager,
        visibility,
        vcs,
        decisions,
        applicationTypes,
        packageTypes,
        monorepoTypes,
        packageBundlers,
        dialect,
        provideExample,
        scope,
        tests,
        publishRegistry
      })
      .mockResolvedValue(projectTypeResults);
    when(scaffoldVerification)
      .calledWith({
        projectRoot,
        dialect,
        visibility,
        packageManager,
        vcs,
        registries,
        tests,
        decisions,
        pathWithinParent,
        unitTestFrameworks
      })
      .mockResolvedValue(verificationResults);
    when(scaffoldNodeVersion).calledWith({projectRoot, nodeVersionCategory}).mockResolvedValue(nodeVersionResults);
    when(scaffoldDialect)
      .calledWith({dialect, configs, projectRoot, projectType, testFilenamePattern})
      .mockResolvedValue(dialectResults);
    when(scaffoldNpmConfig).calledWith({projectType, projectRoot}).mockResolvedValue(npmConfigResults);
    when(scaffoldCodeStyle)
      .calledWith({projectRoot, projectType, configs, vcs, configureLinting})
      .mockResolvedValue(codeStyleResults);
    when(scaffoldChoice)
      .calledWith(
        ciServices,
        ciChoice,
        {projectRoot, vcs, visibility, projectType, projectName, nodeVersion: nodeVersionResults, tests}
      )
      .mockResolvedValue(ciServiceResults);
    when(scaffoldChoice)
      .calledWith(
        hosts,
        hostChoice,
        {projectRoot, projectName, nodeVersion: nodeVersionResults, buildDirectory: `./${buildDirectory}`}
      )
      .mockResolvedValue(hostResults);
    when(scaffoldCommitConvention)
      .calledWith({projectRoot, projectType, configs, pathWithinParent})
      .mockResolvedValue(commitConventionResults);
    when(scaffoldProjectTypePlugin)
      .calledWith({
        projectRoot,
        projectType,
        projectName,
        packageName,
        packageManager,
        scope,
        dialect,
        tests,
        decisions,
        plugins: {
          [projectTypes.PACKAGE]: packageTypes,
          [projectTypes.APPLICATION]: applicationTypes,
          [projectTypes.MONOREPO]: monorepoTypes
        }
      })
      .mockResolvedValue(projectTypePluginResults);
    when(buildVcsIgnoreLists).calledWith(mergedVcsIgnore).mockReturnValue(vcsIgnore);
    when(deepmerge.all)
      .calledWith([
        hostResults,
        ciServiceResults,
        commitConventionResults,
        projectTypeResults,
        verificationResults,
        codeStyleResults,
        npmConfigResults,
        dialectResults,
        projectTypePluginResults
      ])
      .mockReturnValue(mergedResults);
    when(deepmerge)
      .calledWith({devDependencies: ['npm-run-all2'], packageManager}, mergedResults)
      .mockReturnValue(scaffoldingResults);
  });

  it('should scaffold the javascript details', async () => {
    const liftResults = {};
    const badgeResults = any.simpleObject();
    when(lift)
      .calledWith({projectRoot, vcs, pathWithinParent, configs, results: scaffoldingResults})
      .mockResolvedValue(liftResults);
    when(buildBadgesDetails).calledWith([mergedResults, liftResults]).mockReturnValue(badgeResults);

    const results = await scaffold(options);

    expect(results).toEqual({
      documentation,
      tags,
      badges: badgeResults,
      projectDetails: {},
      vcsIgnore,
      verificationCommand: `${documentationCommand} && ${packageManager} test`,
      nextSteps: mergedNextSteps
    });
  });

  it('should return the project homepage when available', async () => {
    const homepage = any.url();
    when(lift)
      .calledWith({projectRoot, vcs, pathWithinParent, configs, results: scaffoldingResults})
      .mockResolvedValue({homepage});

    const {projectDetails} = await scaffold(options);

    expect(projectDetails.homepage).toEqual(homepage);
  });
});
