import {scaffold as scaffoldNpm} from './npm/index.js';
import {scaffold as scaffoldYarn} from './yarn/index.js';

const scaffolders = {
  npm: scaffoldNpm,
  yarn: scaffoldYarn
};

export default function ({projectRoot, packageManager}) {
  return scaffolders[packageManager]({projectRoot});
}
