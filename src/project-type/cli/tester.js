export default async function ({packageDetails: {bin}}) {
  return !!bin;
}
