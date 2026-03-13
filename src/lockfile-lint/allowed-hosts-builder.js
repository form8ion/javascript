export default function buildAllowedHosts({packageManager, registries = {}}) {
  return [
    ...!registries.registry ? [packageManager] : [],
    ...Object.values(Object.fromEntries(Object.entries(registries).filter(([scope]) => 'publish' !== scope)))
  ];
}
