import {addIgnore} from './config';

export default async function ({buildDirectory}) {
  await addIgnore({ignore: buildDirectory});

  return {};
}
