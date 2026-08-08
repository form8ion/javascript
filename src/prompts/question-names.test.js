import {describe, expect, it} from 'vitest';

import {questionNames} from './question-names.js';

describe('question names', () => {
  it('should group question names by prompt area', () => {
    expect(questionNames).toEqual({
      BASE_DETAILS: {
        UNIT_TESTS: 'unitTests',
        INTEGRATION_TESTS: 'integrationTests',
        NODE_VERSION_CATEGORY: 'nodeVersionCategory',
        PACKAGE_MANAGER: 'packageManager',
        PROJECT_TYPE: 'projectType',
        SHOULD_BE_SCOPED: 'shouldBeScoped',
        SCOPE: 'scope',
        AUTHOR_NAME: 'authorName',
        AUTHOR_EMAIL: 'authorEmail',
        AUTHOR_URL: 'authorUrl',
        HOST: 'host',
        CONFIGURE_LINTING: 'configureLint',
        PROVIDE_EXAMPLE: 'provideExample',
        DIALECT: 'dialect'
      },
      UNIT_TESTING: {
        UNIT_TEST_FRAMEWORK: 'unitTestFramework'
      },
      INTEGRATION_TESTING: {
        INTEGRATION_TEST_FRAMEWORK: 'integrationTestFramework'
      },
      PROJECT_TYPE_PLUGIN: {
        PROJECT_TYPE_CHOICE: 'projectTypeChoice'
      },
      PACKAGE_BUNDLER: {
        PACKAGE_BUNDLER: 'packageBundler'
      }
    });
  });
});
