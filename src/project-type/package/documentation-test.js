import {packageManagers} from '@form8ion/javascript-core';

import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import * as documentationCommandBuilder from '../../documentation/generation-command.js';
import scaffoldDocumentation from './documentation.js';

suite('package documentation', () => {
  let sandbox;
  const packageName = any.string();
  const documentationGenerationCommand = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(documentationCommandBuilder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that npm install instructions are provided for packages when the package manager is npm', () => {
    documentationCommandBuilder.default.withArgs(packageManagers.NPM).returns(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.NPM,
      provideExample: true
    });

    assert.equal(documentation.usage, `### Installation

\`\`\`sh
$ npm install ${packageName}
\`\`\`

### Example

run \`${documentationGenerationCommand}\` to inject the usage example`);
  });

  test('that the example section is not included when `provideExample` is `false`', () => {
    documentationCommandBuilder.default.withArgs(packageManagers.NPM).returns(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.NPM,
      provideExample: false
    });

    assert.equal(documentation.usage, `### Installation

\`\`\`sh
$ npm install ${packageName}
\`\`\``);
  });

  test('that yarn add instructions are provided for packages when the package manager is yarn', () => {
    documentationCommandBuilder.default.withArgs(packageManagers.YARN).returns(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.YARN,
      provideExample: true
    });

    assert.equal(documentation.usage, `### Installation

\`\`\`sh
$ yarn add ${packageName}
\`\`\`

### Example

run \`${documentationGenerationCommand}\` to inject the usage example`);
  });

  test('that an error is thrown for unsupported package managers', async () => {
    const packageManager = any.word();

    try {
      scaffoldDocumentation({packageName, packageManager});

      throw new Error('An error should have been thrown for the unsupported package manager');
    } catch (e) {
      assert.equal(
        e.message,
        `The ${packageManager} package manager is currently not supported. `
        + `Only ${Object.values(packageManagers).join(' and ')} are currently supported.`
      );
    }
  });

  test('that an access note is provided for private packages', () => {
    const scope = any.word();
    documentationCommandBuilder.default.withArgs(packageManagers.NPM).returns(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.NPM,
      visibility: 'Private',
      scope,
      provideExample: true
    });

    assert.equal(documentation.usage, `### Installation

:warning: this is a private package, so you will need to use an npm token with
access to private packages under \`@${scope}\`

\`\`\`sh
$ npm install ${packageName}
\`\`\`

### Example

run \`${documentationGenerationCommand}\` to inject the usage example`);
  });
});
