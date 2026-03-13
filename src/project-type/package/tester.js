export default async function projectIsPackage({
  packageDetails: {exports, publishConfig, bin, private: projectMarkedPrivate}
}) {
  return !projectMarkedPrivate && (!!exports || (!!publishConfig && !bin));
}
