export default function mapProjectVisibility({projectVisibility}) {
  return 'OSS' === projectVisibility ? 'public' : 'restricted';
}
