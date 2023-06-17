export default function (packageName, visibility) {
  return {
    consumer: {
      ...'Public' === visibility && {
        npm: {
          img: `https://img.shields.io/npm/v/${packageName}?logo=npm`,
          text: 'npm',
          link: `https://www.npmjs.com/package/${packageName}`
        }
      }
    },
    status: {}
  };
}
