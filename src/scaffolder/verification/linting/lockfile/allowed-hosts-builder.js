export default function ({packageManager, registries}) {
  return [packageManager, ...registries ? Object.values(registries) : []];
}
