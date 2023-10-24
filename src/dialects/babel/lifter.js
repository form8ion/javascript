import {addIgnore} from './config/index.js';

export default async function ({results, projectRoot}) {
  await addIgnore({ignore: results.buildDirectory, projectRoot});

  return {};
}
