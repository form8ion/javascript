function buildNpmBadgeImageUrl(packageName, registry) {
  const params = new URLSearchParams({logo: 'npm', ...registry && {registry_uri: registry}});

  return `https://img.shields.io/npm/v/${packageName}?${params}`;
}

export default function scaffoldPublishableBadges(packageName, accessLevel, registry) {
  return {
    consumer: {
      ...'public' === accessLevel && {
        npm: {
          img: buildNpmBadgeImageUrl(packageName, registry),
          text: 'npm',
          link: `https://www.npmjs.com/package/${packageName}`
        }
      }
    },
    status: {}
  };
}
