import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {scaffoldChoice} from '@form8ion/javascript-core';
import {scaffold as scaffoldCommitConvention} from '@form8ion/commit-convention';

import lift from '../lift';
import {validate} from '../options-validator';
import {prompt} from '../prompts/questions';
import {scaffold as scaffoldDialect} from '../dialects';
import scaffoldNpmConfig from '../config/npm';
import scaffoldDocumentation from '../documentation';
import scaffoldNodeVersion from '../node-version';
import buildBadgesDetails from '../badges';
import buildVcsIgnoreLists from '../vcs-ignore';
import {scaffold as scaffoldPackage} from '../package';
import buildPackageName from '../package-name';
import scaffoldProjectType from './project-type';
import buildDocumentationCommand from '../documentation/generation-command';
import {scaffold as scaffoldVerification} from './verification';
import {scaffold as scaffoldCodeStyle} from '../code-style';

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
    overrides,
    ciServices,
    hosts,
    applicationTypes,
    packageTypes,
    packageBundlers,
    monorepoTypes,
    decisions,
    unitTestFrameworks,
    pathWithinParent,
    registries
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
    packageManager,
    dialect
  } = await prompt(overrides, ciServices, hosts, visibility, vcs, decisions, configs, pathWithinParent);

  info('Writing project files', {level: 'secondary'});

  const packageName = buildPackageName(projectName, scope);
  const {homepage: projectHomepage} = await scaffoldPackage({
    projectRoot,
    projectType,
    dialect,
    packageName,
    license,
    vcs,
    author,
    description,
    pathWithinParent
  });
  const [projectTypeResults, verificationResults] = await Promise.all([
    scaffoldProjectType({
      projectType,
      projectRoot,
      projectName,
      packageName,
      packageManager,
      visibility,
      applicationTypes,
      packageTypes,
      packageBundlers,
      monorepoTypes,
      scope,
      tests,
      vcs,
      decisions,
      dialect,
      publishRegistry: registries.publish
    }),
    scaffoldVerification({
      projectRoot,
      dialect,
      visibility,
      packageManager,
      vcs,
      registries,
      tests,
      unitTestFrameworks,
      decisions,
      pathWithinParent
    })
  ]);
  const [nodeVersion, npmResults, dialectResults, codeStyleResults] = await Promise.all([
    scaffoldNodeVersion({projectRoot, nodeVersionCategory}),
    scaffoldNpmConfig({projectType, projectRoot, registries}),
    scaffoldDialect({
      dialect,
      configs,
      projectRoot,
      projectType,
      buildDirectory: projectTypeResults.buildDirectory,
      testFilenamePattern: verificationResults.testFilenamePattern
    }),
    scaffoldCodeStyle({
      projectRoot,
      projectType,
      dialect,
      configs,
      vcs,
      configureLinting,
      buildDirectory: projectTypeResults.buildDirectory,
      eslint: verificationResults.eslint
    })
  ]);
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
    dialectResults
  ]);

  const liftResults = await lift({
    results: deepmerge({devDependencies: ['npm-run-all'], packageManager}, mergedContributions),
    projectRoot,
    configs,
    vcs
  });

  return {
    badges: buildBadgesDetails([mergedContributions, liftResults]),
    documentation: scaffoldDocumentation({projectTypeResults, packageManager}),
    tags: projectTypeResults.tags,
    vcsIgnore: buildVcsIgnoreLists(mergedContributions.vcsIgnore),
    verificationCommand: `${buildDocumentationCommand(packageManager)} && ${packageManager} test`,
    projectDetails: {...projectHomepage && {homepage: projectHomepage}},
    nextSteps: mergedContributions.nextSteps
  };
}
