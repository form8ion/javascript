export default async function ({packageDetails: {exports, publishConfig, bin}}) {
  return !!exports || (!!publishConfig && !bin);
}
