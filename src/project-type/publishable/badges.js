export default function (packageName, accessLevel) {
  return {
    consumer: {
      ...'public' === accessLevel && {
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
