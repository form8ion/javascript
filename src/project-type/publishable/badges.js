function buildNpmBadgeImageUrl(packageName, customRegistry) {
  const params = new URLSearchParams({logo: 'npm', ...customRegistry && {registry_uri: customRegistry}});

  return `https://img.shields.io/npm/v/${packageName}?${params}`;
}

export default function scaffoldPublishableBadges({packageName, accessLevel, customRegistry}) {
  return {
    consumer: {
      ...'public' === accessLevel && {
        npm: {
          img: buildNpmBadgeImageUrl(packageName, customRegistry),
          text: 'npm',
          link: `https://www.npmjs.com/package/${packageName}`
        }
      }
    },
    status: {}
  };
}
