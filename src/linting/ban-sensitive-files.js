export default function ({pathWithinParent}) {
  if (pathWithinParent) return {};

  return {scripts: {'lint:sensitive': 'ban'}, devDependencies: ['ban-sensitive-files']};
}
