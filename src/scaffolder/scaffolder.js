import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {projectTypes, scaffoldChoice} from '@form8ion/javascript-core';
import {scaffold as scaffoldCommitConvention} from '@form8ion/commit-convention';

import {validate} from '../options/validator.js';
import {prompt} from '../prompts/questions.js';
import {scaffold as scaffoldDialect} from '../dialects/index.js';
import {scaffold as scaffoldNpmConfig} from '../npm-config/index.js';
import {scaffold as scaffoldPackageManager} from '../package-managers/index.js';
import scaffoldDocumentation from '../documentation/index.js';
import {scaffold as scaffoldNodeVersion} from '../node-version/index.js';
import buildVcsIgnoreLists from '../vcs/ignore-lists-builder.js';
import {scaffold as scaffoldPackage} from '../package/index.js';
import {scaffold as scaffoldProjectType} from '../project-type/index.js';
import {scaffold as scaffoldProjectTypePlugin} from '../project-type-plugin/index.js';
import buildDocumentationCommand from '../documentation/generation-command.js';
import {scaffold as scaffoldVerification} from './verification/index.js';
import {scaffold as scaffoldCodeStyle} from '../code-style/index.js';

export default async function (options) {
  info('Initializing JavaScript project');

  const {
    projectRoot,
    projectName,
    visibility,
    license,
    vcs,
    description,
    configs,
    decisions,
    pathWithinParent,
    plugins: {
      applicationTypes,
      packageTypes,
      monorepoTypes,
      packageBundlers,
      unitTestFrameworks,
      hosts,
      ciServices
    }
  } = validate(options);

  const {
    tests,
    projectType,
    ci,
    chosenHost,
    scope,
    nodeVersionCategory,
    author,
    configureLinting,
    provideExample,
    packageManager,
    dialect
  } = await prompt(ciServices, hosts, visibility, vcs, decisions, configs, pathWithinParent);

  info('Writing project files', {level: 'secondary'});

  const {packageName} = await scaffoldPackage({
    projectRoot,
    projectName,
    scope,
    dialect,
    license,
    author,
    description
  });
  const projectTypeResults = await scaffoldProjectType({
    projectType,
    projectRoot,
    projectName,
    packageName,
    packageManager,
    visibility,
    applicationTypes,
    packageTypes,
    monorepoTypes,
    packageBundlers,
    scope,
    tests,
    vcs,
    decisions,
    dialect,
    provideExample,
    publishRegistry: configs.registries.publish
  });
  const verificationResults = await scaffoldVerification({
    projectRoot,
    dialect,
    visibility,
    packageManager,
    vcs,
    registries: configs.registries,
    tests,
    unitTestFrameworks,
    decisions,
    pathWithinParent
  });
  const [nodeVersion, npmResults, dialectResults, codeStyleResults] = await Promise.all([
    scaffoldNodeVersion({projectRoot, nodeVersionCategory}),
    scaffoldNpmConfig({projectType, projectRoot}),
    scaffoldDialect({
      dialect,
      configs,
      projectRoot,
      projectType,
      testFilenamePattern: verificationResults.testFilenamePattern
    }),
    scaffoldCodeStyle({projectRoot, projectType, configs, vcs, configureLinting}),
    scaffoldPackageManager({projectRoot, packageManager})
  ]);
  const projectTypePluginResults = await scaffoldProjectTypePlugin({
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
  });
  const mergedContributions = deepmerge.all([
    ...(await Promise.all([
      scaffoldChoice(
        hosts,
        chosenHost,
        {buildDirectory: `./${projectTypeResults.buildDirectory}`, projectRoot, projectName, nodeVersion}
      ),
      scaffoldChoice(ciServices, ci, {projectRoot, vcs, visibility, projectType, projectName, nodeVersion, tests}),
      scaffoldCommitConvention({projectRoot, projectType, configs, pathWithinParent})
    ])),
    projectTypeResults,
    verificationResults,
    codeStyleResults,
    npmResults,
    dialectResults,
    projectTypePluginResults
  ]);

  return {
    ...mergedContributions,
    documentation: scaffoldDocumentation({projectTypeResults, packageManager}),
    tags: projectTypeResults.tags,
    vcsIgnore: buildVcsIgnoreLists(mergedContributions.vcsIgnore),
    verificationCommand: `${buildDocumentationCommand(packageManager)} && ${packageManager} test`
  };
}
