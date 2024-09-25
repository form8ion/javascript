export default function (registries = {}) {
  return Object.entries(registries)
    .filter(([scope]) => 'publish' !== scope)
    .reduce((acc, [scope, url]) => {
      if ('registry' === scope) return {...acc, registry: url};

      return {...acc, [`@${scope}:registry`]: url};
    }, {registry: 'https://registry.npmjs.org'});
}
