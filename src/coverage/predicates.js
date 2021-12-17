export function shouldBeReported(visibility, tests) {
  return 'Public' === visibility && tests.unit;
}
