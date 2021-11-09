export function scaffold({vcs, visibility}) {
  if ('Public' !== visibility) {
    return {};
  }

  return {
    devDependencies: ['codecov'],
    scripts: {'coverage:report': 'c8 report --reporter=text-lcov > coverage.lcov && codecov'},
    ...['github', 'gitlab', 'bitbucket'].includes(vcs?.host) && {
      badges: {
        status: {
          coverage: {
            img: `https://img.shields.io/codecov/c/${vcs.host}/${vcs.owner}/${vcs.name}.svg`,
            link: `https://codecov.io/${vcs.host}/${vcs.owner}/${vcs.name}`,
            text: 'Codecov'
          }
        }
      }
    }
  };
}
