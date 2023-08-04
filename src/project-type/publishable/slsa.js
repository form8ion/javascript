export default function ({packageDetails: {publishConfig: {access, provenance}}}) {
  if ('public' === access && provenance) {
    return {
      badges: {
        status: {
          slsa: {
            img: 'https://slsa.dev/images/gh-badge-level2.svg',
            url: 'https://slsa.dev',
            text: 'SLSA Level 2'
          }
        }
      }
    };
  }

  return {};
}
