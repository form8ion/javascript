export default function scaffoldRunkitBadge({packageName}) {
  return {
    badges: {
      consumer: {
        runkit: {
          img: `https://badge.runkitcdn.com/${packageName}.svg`,
          text: `Try ${packageName} on RunKit`,
          link: `https://npm.runkit.com/${packageName}`
        }
      }
    }
  };
}
