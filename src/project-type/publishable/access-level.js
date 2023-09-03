export default function ({projectVisibility}) {
  return 'Public' === projectVisibility ? 'public' : 'restricted';
}
