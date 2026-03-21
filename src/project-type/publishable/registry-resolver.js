function isScope(firstPart) {
  return firstPart.startsWith('@');
}

export default function resolveRegistry(packageName, registries = {}) {
  if (registries.publish) return registries.publish;

  const [firstPart] = packageName.split('/');
  if (isScope(firstPart)) {
    const scopedRegistry = registries[firstPart.slice(1)];
    if (scopedRegistry) return scopedRegistry;
  }

  return registries.registry;
}
