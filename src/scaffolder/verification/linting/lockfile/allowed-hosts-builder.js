export default function ({packageManager, registries}) {
  return [
    ...(!registries || (registries && !registries.registry)) ? [packageManager] : [],
    ...registries ? Object.values(registries) : []
  ];
}
