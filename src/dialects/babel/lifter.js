import {addIgnore} from './config/index.js';

export default async function liftBabel({results, projectRoot}) {
  await addIgnore({ignore: results.buildDirectory, projectRoot});

  return {};
}
