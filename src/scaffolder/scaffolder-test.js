import deepmerge from 'deepmerge';
import jsCore from '@form8ion/javascript-core';
import commitConvention from '@form8ion/commit-convention';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as lift from '../lift/lift.js';
import * as prompts from '../prompts/questions.js';
import * as optionsValidator from '../options-validator.js';
import * as dialects from '../dialects/scaffolder.js';
import * as verification from './verification/verifier.js';
import * as codeStyle from '../code-style/scaffolder.js';
import * as npmConfig from '../npm-config/scaffolder.js';
import * as documentation from '../documentation/scaffolder.js';
import * as nodeVersionScaffolder from '../node-version/scaffolder.js';
import * as badgeDetailsBuilder from '../documentation/badges.js';
import * as vcsIgnoresBuilder from '../vcs-ignore.js';
import * as packageScaffolder from '../package/scaffolder.js';
import * as projectTypeScaffolder from '../project-type/scaffolder.js';
import * as projectTypePluginScaffolder from '../project-type-plugin/scaffolder.js';
import * as packageNameBuilder from '../package-name.js';
import * as documentationCommandBuilder from '../documentation/generation-command.js';
import scaffold from './scaffolder.js';

suite('javascript project scaffolder', () => {
  let sandbox;
  const options = any.simpleObject();
  const ciServices = any.simpleObject();
  const hosts = any.simpleObject();
  const projectRoot = any.string();
  const projectName = any.string();
  const packageName = any.string();
  const pathWithinParent = any.string();
  const publishRegistry = any.url();
  const registries = {...any.simpleObject(), publish: publishRegistry};
  const homepage = any.url();
  const decisions = any.simpleObject();
  const unitTestFrameworks = any.simpleObject();
  const visibility = any.fromList(['Private', 'Public']);
  const version = any.string();
  const commitConventionDevDependencies = any.listOf(any.string);
  const testingNextSteps = any.listOf(any.simpleObject);
  const ciServiceNextSteps = any.listOf(any.simpleObject);
  const projectTypeNextSteps = any.listOf(any.simpleObject);
  const hostResults = any.simpleObject();
  const npmResults = any.simpleObject();
  const chosenHost = any.word();
  const chosenDialect = any.word();
  const provideExample = any.boolean();
  const projectType = any.word();
  const scope = any.word();
  const license = any.string();
  const authorName = any.string();
  const authorEmail = any.string();
  const authorUrl = any.url();
  const integrationTested = any.boolean();
  const unitTested = any.boolean();
  const tests = {unit: unitTested, integration: integrationTested};
  const vcsDetails = any.simpleObject();
  const chosenCiService = any.word();
  const overrides = any.simpleObject();
  const description = any.sentence();
  const babelPresetName = any.string();
  const babelPreset = {name: babelPresetName};
  const configs = {babelPreset, ...any.simpleObject()};
  const nodeVersionCategory = any.word();
  const testFilenamePattern = any.string();
  const verificationResults = {
    ...any.simpleObject(),
    nextSteps: testingNextSteps,
    testFilenamePattern
  };
  const codeStyleResults = any.simpleObject();
  const ciServiceResults = {...any.simpleObject(), nextSteps: ciServiceNextSteps};
  const commitConventionResults = {...any.simpleObject(), packageProperties: any.simpleObject()};
  const applicationTypes = any.simpleObject();
  const packageTypes = any.simpleObject();
  const packageBundlers = any.simpleObject();
  const monorepoTypes = any.simpleObject();
  const configureLinting = any.boolean();
  const projectTypeBuildDirectory = any.string();
  const projectTypePackageProperties = any.simpleObject();
  const dialectPackageProperties = any.simpleObject();
  const projectTypeTags = any.listOf(any.word);
  const packageManager = any.word();
  const dialectResults = {
    ...any.simpleObject(),
    eslint: any.simpleObject(),
    packageProperties: dialectPackageProperties
  };
  const projectTypeResults = {
    ...any.simpleObject(),
    buildDirectory: projectTypeBuildDirectory,
    packageProperties: projectTypePackageProperties,
    nextSteps: projectTypeNextSteps,
    tags: projectTypeTags
  };
  const projectTypePluginResults = any.simpleObject();
  const contributors = [
    hostResults,
    ciServiceResults,
    commitConventionResults,
    projectTypeResults,
    projectTypePluginResults,
    verificationResults,
    codeStyleResults,
    npmResults,
    dialectResults
  ];
  const mergedContributions = deepmerge.all(contributors);
  const packageScaffoldingInputs = {
    projectRoot,
    dialect: chosenDialect,
    packageName,
    license,
    author: {name: authorName, email: authorEmail, url: authorUrl},
    description
  };
  const commonPromptAnswers = {
    nodeVersionCategory,
    projectType,
    tests,
    scope,
    author: {name: authorName, email: authorEmail, url: authorUrl},
    ci: chosenCiService,
    chosenHost,
    configureLinting,
    provideExample,
    packageManager,
    dialect: chosenDialect
  };
  const liftResults = {...any.simpleObject(), badges: any.simpleObject(), homepage};

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(prompts, 'prompt');
    sandbox.stub(optionsValidator, 'validate');
    sandbox.stub(jsCore, 'scaffoldChoice');
    sandbox.stub(lift, 'default');
    sandbox.stub(dialects, 'default');
    sandbox.stub(verification, 'scaffoldVerification');
    sandbox.stub(codeStyle, 'default');
    sandbox.stub(npmConfig, 'default');
    sandbox.stub(documentation, 'default');
    sandbox.stub(nodeVersionScaffolder, 'default');
    sandbox.stub(badgeDetailsBuilder, 'default');
    sandbox.stub(vcsIgnoresBuilder, 'default');
    sandbox.stub(commitConvention, 'scaffold');
    sandbox.stub(packageScaffolder, 'default');
    sandbox.stub(packageNameBuilder, 'default');
    sandbox.stub(projectTypeScaffolder, 'default');
    sandbox.stub(projectTypePluginScaffolder, 'default');
    sandbox.stub(documentationCommandBuilder, 'default');

    packageNameBuilder.default.withArgs(projectName, scope).returns(packageName);
    projectTypeScaffolder.default
      .withArgs({
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
        vcs: vcsDetails,
        decisions,
        provideExample,
        dialect: chosenDialect,
        publishRegistry
      })
      .resolves(projectTypeResults);
    projectTypePluginScaffolder.default
      .withArgs({
        projectRoot,
        projectType,
        projectName,
        packageName,
        packageManager,
        scope,
        dialect: chosenDialect,
        tests,
        decisions,
        plugins: {
          [jsCore.projectTypes.PACKAGE]: packageTypes,
          [jsCore.projectTypes.APPLICATION]: applicationTypes,
          [jsCore.projectTypes.MONOREPO]: monorepoTypes
        }
      })
      .resolves(projectTypePluginResults);
    packageScaffolder.default.withArgs(packageScaffoldingInputs).resolves(any.simpleObject());
    prompts.prompt
      .withArgs(overrides, ciServices, hosts, visibility, vcsDetails, decisions, configs, pathWithinParent)
      .resolves(commonPromptAnswers);
    jsCore.scaffoldChoice
      .withArgs(
        ciServices,
        chosenCiService,
        {
          projectRoot,
          vcs: vcsDetails,
          visibility,
          projectType,
          projectName,
          nodeVersion: version,
          tests
        }
      )
      .resolves(ciServiceResults);
    verification.scaffoldVerification
      .withArgs({
        projectRoot,
        dialect: chosenDialect,
        visibility,
        packageManager,
        vcs: vcsDetails,
        registries,
        tests,
        unitTestFrameworks,
        decisions,
        pathWithinParent
      })
      .resolves(verificationResults);
    codeStyle.default
      .withArgs({projectRoot, projectType, configs, vcs: vcsDetails, configureLinting})
      .resolves(codeStyleResults);
    dialects.default
      .withArgs({
        projectRoot,
        projectType,
        configs,
        dialect: chosenDialect,
        testFilenamePattern
      })
      .resolves(dialectResults);
    npmConfig.default.resolves(npmResults);
    commitConvention.scaffold
      .withArgs({projectRoot, projectType, configs, pathWithinParent})
      .resolves(commitConventionResults);
    nodeVersionScaffolder.default.withArgs({projectRoot, nodeVersionCategory}).resolves(version);
    optionsValidator.validate
      .withArgs(options)
      .returns({
        visibility,
        projectRoot,
        configs,
        plugins: {
          applicationTypes,
          packageTypes,
          packageBundlers,
          monorepoTypes,
          unitTestFrameworks
        },
        ciServices,
        overrides,
        hosts,
        projectName,
        license,
        vcs: vcsDetails,
        description,
        decisions,
        pathWithinParent,
        registries
      });
    lift.default
      .withArgs({
        results: deepmerge.all([{devDependencies: ['npm-run-all2'], packageManager}, ...contributors]),
        projectRoot,
        configs,
        vcs: vcsDetails,
        pathWithinParent
      })
      .resolves(liftResults);
  });

  teardown(() => sandbox.restore());

  suite('npm-config files', () => {
    test('that npm-config files are created', async () => {
      jsCore.scaffoldChoice
        .withArgs(
          hosts,
          chosenHost,
          {buildDirectory: `./${projectTypeBuildDirectory}`, projectRoot, projectName, nodeVersion: version}
        )
        .resolves(hostResults);

      await scaffold(options);

      assert.calledWith(
        dialects.default,
        {configs, projectRoot, projectType, dialect: chosenDialect, testFilenamePattern}
      );
      assert.calledWith(npmConfig.default, {projectRoot, projectType, registries});
    });
  });

  suite('data passed downstream', () => {
    setup(
      () => jsCore.scaffoldChoice
        .withArgs(
          hosts,
          chosenHost,
          {buildDirectory: `./${projectTypeBuildDirectory}`, projectRoot, projectName, nodeVersion: version}
        )
        .resolves(hostResults)
    );

    suite('badges', () => {
      test('that badges are provided', async () => {
        const builtBadges = any.simpleObject();
        badgeDetailsBuilder.default.withArgs([mergedContributions, liftResults]).returns(builtBadges);

        const {badges} = await scaffold(options);

        assert.equal(badges, builtBadges);
      });
    });

    suite('vcs ignore', () => {
      test('that ignores are defined', async () => {
        const ignores = any.simpleObject();
        vcsIgnoresBuilder.default.withArgs(mergedContributions.vcsIgnore).returns(ignores);
        commitConvention.scaffold.resolves({devDependencies: commitConventionDevDependencies});

        const {vcsIgnore} = await scaffold(options);

        assert.equal(vcsIgnore, ignores);
      });
    });

    suite('verification', () => {
      test('that the verification command enhances documentation before verifying', async () => {
        const documentationGenerationCommand = any.string();
        documentationCommandBuilder.default.withArgs(packageManager).returns(documentationGenerationCommand);

        const {verificationCommand} = await scaffold(options);

        assert.equal(verificationCommand, `${documentationGenerationCommand} && ${packageManager} test`);
      });
    });

    suite('project details', () => {
      test('that details are passed along', async () => {
        const {projectDetails} = await scaffold(options);

        assert.equal(projectDetails.homepage, homepage);
      });

      test('that details are not passed along if not defined', async () => {
        lift.default
          .withArgs({
            results: deepmerge.all([{devDependencies: ['npm-run-all2'], packageManager}, ...contributors]),
            projectRoot,
            configs,
            vcs: vcsDetails,
            pathWithinParent
          })
          .resolves(any.simpleObject());

        const {projectDetails} = await scaffold(options);

        assert.isUndefined(projectDetails.homepage);
      });
    });

    suite('documentation', () => {
      test('that appropriate documentation is passed along', async () => {
        const docs = any.simpleObject();
        documentation.default.withArgs({projectTypeResults, packageManager}).returns(docs);
        optionsValidator.validate
          .returns({projectRoot, projectName, visibility, vcs: {}, configs: {}, ciServices, scope});

        const {documentation: documentationContent, tags} = await scaffold(options);

        assert.equal(documentationContent, docs);
        assert.equal(tags, projectTypeTags);
      });
    });

    suite('next steps', () => {
      test('that next steps are included from the project-type scaffolder', async () => {
        const {nextSteps} = await scaffold(options);

        assert.deepEqual(nextSteps, [...ciServiceNextSteps, ...projectTypeNextSteps, ...testingNextSteps]);
      });
    });
  });
});
