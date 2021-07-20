import any from '@travi/any';
import {assert} from 'chai';
import {scaffold} from './codecov';

suite('codecov', () => {
  test('that codecov details are scaffolded', () => {
    const vcs = {
      ...any.simpleObject(),
      host: any.fromList(['github', 'gitlab', 'bitbucket']),
      owner: any.word(),
      name: any.word()
    };

    const {badges, devDependencies, scripts} = scaffold({vcs, visibility: 'Public'});

    assert.deepEqual(devDependencies, ['codecov']);
    assert.equal(scripts['coverage:report'], 'nyc report --reporter=text-lcov > coverage.lcov && codecov');
    assert.deepEqual(
      badges,
      {
        status: {
          coverage: {
            img: `https://img.shields.io/codecov/c/github/${vcs.owner}/${vcs.name}.svg`,
            link: `https://codecov.io/github/${vcs.owner}/${vcs.name}`,
            text: 'Codecov'
          }
        }
      }
    );
  });

  test('that the badge is not defined if shields.io badge does not support the vcs host', () => {
    const {badges, devDependencies, scripts} = scaffold({visibility: 'Public', vcs: {host: any.word()}});

    assert.isUndefined(badges);
    assert.deepEqual(devDependencies, ['codecov']);
    assert.equal(scripts['coverage:report'], 'nyc report --reporter=text-lcov > coverage.lcov && codecov');
  });

  test('that the badge is not defined if vcs details are not defined', () => {
    const {badges, devDependencies, scripts} = scaffold({visibility: 'Public'});

    assert.isUndefined(badges);
    assert.deepEqual(devDependencies, ['codecov']);
    assert.equal(scripts['coverage:report'], 'nyc report --reporter=text-lcov > coverage.lcov && codecov');
  });

  test('that details are not defined if the project is private', () => {
    assert.deepEqual(scaffold({visibility: 'Private'}), {});
  });
});
