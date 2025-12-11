export default async function ({packageDetails: {exports, publishConfig, bin, private: projectMarkedPrivate}}) {
  return !projectMarkedPrivate && (!!exports || (!!publishConfig && !bin));
}
