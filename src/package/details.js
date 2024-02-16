import {dialects} from '@form8ion/javascript-core';

export default function ({
  packageName,
  dialect,
  license,
  author,
  description
}) {
  return {
    name: packageName,
    description,
    license,
    type: dialects.ESM === dialect ? 'module' : 'commonjs',
    author: `${author.name}${author.email ? ` <${author.email}>` : ''}${author.url ? ` (${author.url})` : ''}`,
    scripts: {}
  };
}
