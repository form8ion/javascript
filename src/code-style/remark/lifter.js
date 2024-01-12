import {fileTypes} from '@form8ion/core';
import {load, write} from '@form8ion/config-file';

export default async function ({projectRoot}) {
  const CONFIG_NAME = 'remark';

  await write({format: fileTypes.JSON, path: projectRoot, name: CONFIG_NAME, config: await load({name: CONFIG_NAME})});

  return {};
}
