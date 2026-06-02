export function scope(visibility) {
  return input => {
    if (!input) {
      if ('CS' === visibility) {
        return 'Closed source packages must be scoped';
      }
      if ('ISS' === visibility) {
        return 'Inner source packages must be scoped';
      }
    }

    return true;
  };
}
