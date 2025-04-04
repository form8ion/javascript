import {promises as fs} from 'node:fs';
import {fileExists} from '@form8ion/core';
import {dialects, packageManagers, projectTypes} from '@form8ion/javascript-core';

import {assert} from 'chai';
import {Given} from '@cucumber/cucumber';

export async function assertThatDocumentationIsDefinedAppropriately(
  projectRoot,
  projectType,
  projectName,
  dialect,
  exampleShouldBeProvided
) {
  const pathToExampleFile = `${projectRoot}/example.js`;
  const packageDetails = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  if (projectTypes.PACKAGE === projectType && exampleShouldBeProvided && dialects.COMMON_JS === dialect) {
    const exampleContents = (await fs.readFile(pathToExampleFile)).toString();

    assert.equal(exampleContents, "const {} = require('.');\n");
    assert.isTrue(await fileExists(`${process.cwd()}/index.js`));
    assert.isDefined(packageDetails.scripts['generate:md']);
    assert.isUndefined(packageDetails.scripts['pregenerate:md']);
  } else if (projectTypes.PACKAGE === projectType && exampleShouldBeProvided) {
    const exampleContents = (await fs.readFile(pathToExampleFile)).toString();

    assert.equal(exampleContents, `import {} from './lib/index.js';
`);
    assert.isTrue(await fileExists(`${projectRoot}/src/index.js`));
    assert.isDefined(packageDetails.scripts['generate:md']);
    assert.isDefined(packageDetails.scripts['pregenerate:md']);
  } else {
    assert.isFalse(await fileExists(pathToExampleFile), `${pathToExampleFile} should not exist`);
    assert.isUndefined(packageDetails.scripts['pregenerate:md']);
  }
}

export function assertThatDocumentationResultsAreReturnedCorrectly(
  projectType,
  scope,
  projectName,
  visibility,
  results,
  packageManager,
  provideExample
) {
  assert.equal(
    results.documentation.toc,
    `Run \`${
      packageManagers.NPM === packageManager ? 'npm run' : ''
    }${
      packageManagers.YARN === packageManager ? 'yarn' : ''
    } generate:md\` to generate a table of contents`
  );
  assert.equal(
    results.documentation.contributing,
    `### Dependencies

\`\`\`sh\n$ nvm install\n$ ${packageManager} install\n\`\`\`

### Verification

\`\`\`sh\n$ ${packageManager} test\n\`\`\``
  );

  if ('Package' === projectType) {
    if ('Public' === visibility) {
      assert.equal(
        results.documentation.usage,
        `### Installation

\`\`\`sh
$ ${
  packageManagers.NPM === packageManager ? 'npm install' : ''
}${
  packageManagers.YARN === packageManager ? 'yarn add' : ''
} @${scope}/${projectName}
\`\`\`${provideExample
    ? `

### Example

run \`${
  packageManagers.NPM === packageManager ? 'npm run' : ''
}${
  packageManagers.YARN === packageManager ? 'yarn' : ''
} generate:md\` to inject the usage example`
    : ''
}`
      );
    }

    if ('Private' === visibility) {
      assert.equal(
        results.documentation.usage,
        `### Installation

:warning: this is a private package, so you will need to use an npm token with
access to private packages under \`@${scope}\`

\`\`\`sh
$ ${
  packageManagers.NPM === packageManager ? 'npm install' : ''
}${
  packageManagers.YARN === packageManager ? 'yarn add' : ''
} @${scope}/${projectName}
\`\`\`${provideExample
    ? `

### Example

run \`${
  packageManagers.NPM === packageManager ? 'npm run' : ''
}${
  packageManagers.YARN === packageManager ? 'yarn' : ''
} generate:md\` to inject the usage example`
    : ''
}`
      );
    }
  }
}

Given('an example should not be provided', async function () {
  this.provideExample = false;
});
