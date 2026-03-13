import defineBadges from './badges.js';

export default async function scaffoldPublishable({packageName, packageAccessLevel}) {
  return {
    badges: await defineBadges(packageName, packageAccessLevel)
  };
}
