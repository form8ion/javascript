import {addIgnore} from './config';

export default async function ({results, projectRoot}) {
  await addIgnore({ignore: results.buildDirectory, projectRoot});

  return {};
}
