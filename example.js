// #### Import
// remark-usage-ignore-next 4
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import 'validate-npm-package-name';

// remark-usage-ignore-next 11
stubbedFs({
  node_modules: stubbedFs.load(resolve('node_modules')),
  '.nvmrc': 'v1.2.3',
  lib: stubbedFs.load(resolve('lib')),
  templates: stubbedFs.load(resolve('templates'))
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
  questionNames
} = await import('./lib/index.js');

const {
  BASE_DETAILS,
  UNIT_TESTING
} = questionNames;

// #### Execute
const accountName = 'form8ion';
const projectRoot = process.cwd();

await scaffoldJavaScript({
  projectRoot,
  projectName: 'project-name',
  visibility: 'OSS',
  license: 'MIT',
  configs: {
    eslint: {scope: `@${accountName}`},
    remark: `@${accountName}/remark-lint-preset`,
    babelPreset: {name: `@${accountName}`, packageName: `@${accountName}/babel-preset`},
    commitlint: {name: `@${accountName}`, packageName: `@${accountName}/commitlint-config`}
  },
  plugins: {
    unitTestFrameworks: {},
    applicationTypes: {},
    packageTypes: {},
    packageBundlers: {},
    ciServices: {}
  },
  decisions: {
    [BASE_DETAILS.DIALECT]: dialects.BABEL,
    [BASE_DETAILS.NODE_VERSION_CATEGORY]: 'LTS',
    [BASE_DETAILS.PACKAGE_MANAGER]: 'npm',
    [BASE_DETAILS.PROJECT_TYPE]: projectTypes.PACKAGE,
    [BASE_DETAILS.SHOULD_BE_SCOPED]: true,
    [BASE_DETAILS.SCOPE]: accountName,
    [BASE_DETAILS.AUTHOR_NAME]: 'Your Name',
    [BASE_DETAILS.AUTHOR_EMAIL]: 'you@domain.tld',
    [BASE_DETAILS.AUTHOR_URL]: 'https://your.website.tld',
    [BASE_DETAILS.UNIT_TESTS]: true,
    [BASE_DETAILS.INTEGRATION_TESTS]: true,
    [BASE_DETAILS.PROVIDE_EXAMPLE]: true
  }
});

if (await thisIsAJavaScriptProject({projectRoot})) {
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
  });
}

await scaffoldUnitTesting({
  projectRoot: process.cwd(),
  frameworks: {
    Mocha: {scaffold: options => options},
    Jest: {scaffold: options => options}
  },
  visibility: 'OSS',
  vcs: {host: 'GitHub', owner: 'foo', name: 'bar'},
  decisions: {[UNIT_TESTING.UNIT_TEST_FRAMEWORK]: 'Mocha'}
});
