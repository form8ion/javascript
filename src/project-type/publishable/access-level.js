export default function mapProjectVisibility({projectVisibility}) {
  return 'Public' === projectVisibility ? 'public' : 'restricted';
}
