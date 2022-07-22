import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

export default function ({projectRoot, config}) {
  return write({path: projectRoot, name: 'babel', format: fileTypes.JSON, config});
}
