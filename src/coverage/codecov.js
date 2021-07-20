export function scaffold({vcs, visibility}) {
  if ('Public' !== visibility) {
    return {};
  }

  return {
    devDependencies: ['codecov'],
    scripts: {'coverage:report': 'nyc report --reporter=text-lcov > coverage.lcov && codecov'},
    ...['github', 'gitlab', 'bitbucket'].includes(vcs?.host) && {
      badges: {
        status: {
          coverage: {
            img: `https://img.shields.io/codecov/c/github/${vcs.owner}/${vcs.name}.svg`,
            link: `https://codecov.io/github/${vcs.owner}/${vcs.name}`,
            text: 'Codecov'
          }
        }
      }
    }
  };
}
