import {describe, it} from 'vitest';

import removeRunkit from './remover.js';

describe('runkit remover', () => {
  it('should remove runkit details from the project', async () => {
    await removeRunkit();
  });
});
