import {promises as fs} from 'fs';

import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';

import * as configWriter from './write';
import addIgnore from './ignore-adder';

suite('babel ignore adder', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(configWriter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the provided ignore is added to the existing config', async () => {
    const pathToIgnore = any.string();
    const existingConfig = any.simpleObject();
    fs.readFile.withArgs(`${projectRoot}/.babelrc.json`, 'utf-8').resolves(JSON.stringify(existingConfig));

    await addIgnore({projectRoot, ignore: pathToIgnore});

    assert.calledWith(configWriter.default, {projectRoot, config: {...existingConfig, ignore: [`./${pathToIgnore}/`]}});
  });

  test('that the config is not updated if no `buildDirectory` is provided', async () => {
    await addIgnore({projectRoot});

    assert.notCalled(fs.readFile);
    assert.notCalled(configWriter.default);
  });
});
