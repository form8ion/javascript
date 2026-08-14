// #### Import
// remark-usage-ignore-next 4
import {resolve} from 'path';
import {existsSync} from 'fs';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import 'validate-npm-package-name';

// remark-usage-ignore-next 11
stubbedFs({
  node_modules: stubbedFs.load(resolve('node_modules')),
  '.nvmrc': 'v1.2.3',
  lib: stubbedFs.load(resolve('lib')),
  ...existsSync(resolve('templates')) && {templates: stubbedFs.load(resolve('templates'))}
});
const {execa} = await td.replaceEsm('execa');
td.when(execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
  .thenResolve({stdout: ['v16.5.4', ''].join('\n')});
td.when(execa('. ~/.nvm/nvm.sh && nvm install', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
td.when(execa('npm', ['--version'])).thenResolve({stdout: '10.6.18'});

const {dialects, projectTypes} = await import('@form8ion/javascript-core');
const {
  scaffold: scaffoldJavaScript,
  lift: liftJavascript,
  test: thisIsAJavaScriptProject,
  scaffoldUnitTesting,
  promptConstants
} = await import('./lib/index.js');

// #### Execute
const accountName = 'form8ion';
const projectRoot = process.cwd();
const logger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  success: () => undefined
};

await scaffoldJavaScript(
  {
    projectRoot,
    projectName: 'project-name',
    visibility: 'OSS',
    license: 'MIT',
    configs: {
      eslint: {scope: `@${accountName}`},
      remark: `@${accountName}/remark-lint-preset`,
      babelPreset: {
        name: `@${accountName}`,
        packageName: `@${accountName}/babel-preset`
      },
      commitlint: {
        name: `@${accountName}`,
        packageName: `@${accountName}/commitlint-config`
      }
    },
    plugins: {
      unitTestFrameworks: {},
      applicationTypes: {},
      packageTypes: {},
      packageBundlers: {},
      ciServices: {}
    }
  },
  {
    logger,
    prompt: ({id}) => {
      const {questionNames, ids} = promptConstants;
      const {BASE_DETAILS: baseDetailsPromptId} = ids;

      switch (id) {
        case baseDetailsPromptId: {
          const {
            DIALECT,
            NODE_VERSION_CATEGORY,
            PACKAGE_MANAGER,
            PROJECT_TYPE,
            SHOULD_BE_SCOPED,
            SCOPE,
            AUTHOR_NAME,
            AUTHOR_EMAIL,
            AUTHOR_URL,
            UNIT_TESTS,
            INTEGRATION_TESTS,
            PROVIDE_EXAMPLE
          } = questionNames[baseDetailsPromptId];

          return {
            [DIALECT]: dialects.ESM,
            [NODE_VERSION_CATEGORY]: 'LTS',
            [PACKAGE_MANAGER]: 'npm',
            [PROJECT_TYPE]: projectTypes.PACKAGE,
            [SHOULD_BE_SCOPED]: true,
            [SCOPE]: accountName,
            [AUTHOR_NAME]: 'Your Name',
            [AUTHOR_EMAIL]: 'you@domain.tld',
            [AUTHOR_URL]: 'https://your.website.tld',
            [UNIT_TESTS]: true,
            [INTEGRATION_TESTS]: true,
            [PROVIDE_EXAMPLE]: true
          };
        }
        default:
          throw new Error(`Unknown prompt with ID: ${id}`);
      }
    }
  }
);

if (await thisIsAJavaScriptProject({projectRoot}, {logger})) {
  await liftJavascript({
    projectRoot,
    configs: {eslint: {scope: '@foo'}},
    results: {
      dependencies: {javascript: {production: [], development: []}},
      scripts: {},
      eslint: {configs: [], ignore: {directories: []}},
      packageManager: 'npm'
    },
    enhancers: {
      PluginName: {
        test: () => true,
        lift: () => ({})
      }
    }
  }, {logger});
}

await scaffoldUnitTesting(
  {
    projectRoot: process.cwd(),
    frameworks: {
      Mocha: {scaffold: options => options},
      Jest: {scaffold: options => options}
    },
    visibility: 'OSS',
    vcs: {
      host: 'GitHub',
      owner: 'foo',
      name: 'bar'
    }
  },
  {
    logger,
    prompt: ({id}) => {
      const {questionNames, ids} = promptConstants;
      const {UNIT_TESTING: unitTestingPromptId} = ids;

      switch (id) {
        case unitTestingPromptId: {
          const {UNIT_TEST_FRAMEWORK} = questionNames[unitTestingPromptId];

          return {[UNIT_TEST_FRAMEWORK]: 'Vitest'};
        }
        default:
          throw new Error(`Unknown prompt with ID: ${id}`);
      }
    }
  }
);
