import {packageManagers} from '@form8ion/javascript-core';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import buildDocumentationCommand from '../../documentation/generation-command.js';
import scaffoldDocumentation from './documentation.js';

vi.mock('../../documentation/generation-command.js');

describe('package documentation', () => {
  const packageName = any.string();
  const documentationGenerationCommand = any.string();

  it('should provide `npm install` instructions for packages when the package manager is npm', () => {
    when(buildDocumentationCommand).calledWith(packageManagers.NPM).thenReturn(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.NPM,
      provideExample: true
    });

    expect(documentation.usage).toEqual(`### Installation

\`\`\`sh
$ npm install ${packageName}
\`\`\`

### Example

run \`${documentationGenerationCommand}\` to inject the usage example`);
  });

  it('should not include the example section when `provideExample` is `false`', () => {
    when(buildDocumentationCommand).calledWith(packageManagers.NPM).thenReturn(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.NPM,
      provideExample: false
    });

    expect(documentation.usage).toEqual(`### Installation

\`\`\`sh
$ npm install ${packageName}
\`\`\``);
  });

  it('should provide `yarn add` instructions for packages when the package manager is yarn', () => {
    when(buildDocumentationCommand).calledWith(packageManagers.YARN).thenReturn(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.YARN,
      provideExample: true
    });

    expect(documentation.usage).toEqual(`### Installation

\`\`\`sh
$ yarn add ${packageName}
\`\`\`

### Example

run \`${documentationGenerationCommand}\` to inject the usage example`);
  });

  it('should throw an error for unsupported package managers', () => {
    const packageManager = any.word();

    expect(() => scaffoldDocumentation({packageName, packageManager})).toThrowError(
      `The ${packageManager} package manager is currently not supported. `
      + `Only ${Object.values(packageManagers).join(' and ')} are currently supported.`
    );
  });

  it('should provide an access note for private packages', () => {
    const scope = any.word();
    when(buildDocumentationCommand).calledWith(packageManagers.NPM).thenReturn(documentationGenerationCommand);

    const documentation = scaffoldDocumentation({
      packageName,
      packageManager: packageManagers.NPM,
      visibility: 'Private',
      scope,
      provideExample: true
    });

    expect(documentation.usage).toEqual(`### Installation

:warning: this is a private package, so you will need to use an npm token with
access to private packages under \`@${scope}\`

\`\`\`sh
$ npm install ${packageName}
\`\`\`

### Example

run \`${documentationGenerationCommand}\` to inject the usage example`);
  });
});
