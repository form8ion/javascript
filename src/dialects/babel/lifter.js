import {addIgnore} from './config';

export default async function ({buildDirectory, projectRoot}) {
  await addIgnore({ignore: buildDirectory, projectRoot});

  return {};
}
