export default async function liftEngines({packageDetails: {name}}) {
  return {
    dependencies: {javascript: {development: ['ls-engines']}},
    scripts: {'lint:engines': 'ls-engines'},
    badges: {consumer: {node: {img: `https://img.shields.io/node/v/${name}?logo=node.js`, text: 'node'}}}
  };
}
