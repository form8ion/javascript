import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftEngines from './lifter.js';

describe('engines lifter', () => {
  it('should return the details for linting and communicating engines restrictions', async () => {
    const packageName = any.word();
    const packageDetails = {...any.simpleObject(), name: packageName};

    const {scripts, badges, dependencies} = await liftEngines({packageDetails});

    expect(scripts['lint:engines']).toEqual('ls-engines');
    expect(dependencies.javascript.development).toEqual(['ls-engines']);
    expect(badges.consumer.node)
      .toEqual({img: `https://img.shields.io/node/v/${packageName}?logo=node.js`, text: 'node'});
  });
});
