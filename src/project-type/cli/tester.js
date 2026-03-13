export default async function projectIsCli({packageDetails: {bin}}) {
  return !!bin;
}
