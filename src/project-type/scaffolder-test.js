import {projectTypes} from '@form8ion/javascript-core';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as packageTypeScaffolder from './package/scaffolder';
import * as applicationTypeScaffolder from './application';
import * as monorepoTypeScaffolder from './monorepo';
import * as cliTypeScaffolder from './cli';
import projectTypeScaffolder from './index';

suite('project-type scaffolder', () => {
  let sandbox;
  const results = any.simpleObject();
  const projectRoot = any.string();
  const projectName = any.word();
  const packageName = any.word();
  const packageManager = any.word();
  const visibility = any.word();
  const decisions = any.simpleObject();
  const vcs = any.simpleObject();
  const publishRegistry = any.url();
  const dialect = any.word();
  const provideExample = any.boolean();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(packageTypeScaffolder, 'default');
    sandbox.stub(applicationTypeScaffolder, 'default');
    sandbox.stub(cliTypeScaffolder, 'default');
    sandbox.stub(monorepoTypeScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the package-type scaffolder is applied when the project-type is `Package`', async () => {
    const scope = any.word();
    const packageBundlers = any.simpleObject();

    packageTypeScaffolder.default
      .withArgs({
        projectRoot,
        packageName,
        projectName,
        packageManager,
        visibility,
        scope,
        packageBundlers,
        vcs,
        decisions,
        dialect,
        provideExample,
        publishRegistry
      })
      .resolves(results);

    assert.deepEqual(
      await projectTypeScaffolder({
        projectType: projectTypes.PACKAGE,
        projectRoot,
        projectName,
        packageName,
        packageManager,
        visibility,
        scope,
        packageBundlers,
        vcs,
        decisions,
        dialect,
        provideExample,
        publishRegistry
      }),
      results
    );
  });

  test('that the application-type scaffolder is applied when the project-type is `Application`', async () => {
    applicationTypeScaffolder.default
      .withArgs({projectRoot})
      .resolves(results);

    assert.deepEqual(
      await projectTypeScaffolder({
        projectType: projectTypes.APPLICATION,
        projectRoot,
        projectName,
        packageName,
        packageManager,
        decisions,
        visibility,
        vcs
      }),
      results
    );
  });

  test('that the cli-type scaffolder is applied when the project-type is `CLI`', async () => {
    cliTypeScaffolder.default
      .withArgs({packageName, visibility, projectRoot, dialect, publishRegistry})
      .resolves(results);

    assert.deepEqual(
      await projectTypeScaffolder({
        projectType: projectTypes.CLI,
        packageName,
        visibility,
        vcs,
        projectRoot,
        dialect,
        publishRegistry
      }),
      results
    );
  });

  test('that the monorepo-type scaffolder is applied when the project-type is `Monorepo`', async () => {
    monorepoTypeScaffolder.default.withArgs({projectRoot}).resolves(results);

    assert.deepEqual(
      await projectTypeScaffolder({projectRoot, projectType: projectTypes.MONOREPO, packageManager, decisions}),
      results
    );
  });

  test('that no error is thrown when the project-type is `Other`', async () => {
    assert.deepEqual(
      await projectTypeScaffolder({projectType: 'Other'}),
      {}
    );
  });

  test('that an error is thrown for an unknown project-type', () => {
    const projectType = any.word();

    return assert.isRejected(projectTypeScaffolder({projectType}), `The project-type of ${projectType} is invalid`);
  });
});
