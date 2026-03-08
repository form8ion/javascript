export default function scaffoldRunkitBadge({packageName, visibility}) {
  return {
    badges: {
      consumer: {
        ...'Public' === visibility && {
          runkit: {
            img: `https://badge.runkitcdn.com/${packageName}.svg`,
            text: `Try ${packageName} on RunKit`,
            link: `https://npm.runkit.com/${packageName}`
          }
        }
      }
    }
  };
}
