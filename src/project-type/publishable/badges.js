function buildNpmBadgeImageUrl(packageName, customRegistry) {
  const params = new URLSearchParams({logo: 'npm', ...customRegistry && {registry_uri: customRegistry}});

  return `https://img.shields.io/npm/v/${packageName}?${params}`;
}

export default function scaffoldPublishableBadges({packageName, accessLevel, customRegistry, registryPage}) {
  return {
    consumer: {
      ...'public' === accessLevel && {
        npm: {
          img: buildNpmBadgeImageUrl(packageName, customRegistry),
          text: 'npm',
          link: registryPage
        }
      }
    },
    status: {}
  };
}
