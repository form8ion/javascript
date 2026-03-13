export default function projectIsApplication({packageDetails}) {
  return !!packageDetails.private;
}
