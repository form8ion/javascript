import autoExternal from 'rollup-plugin-auto-external';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    nodeResolve({mainFields: ['module']})
  ],
  output: [
    {file: 'lib/index.js', format: 'cjs', sourcemap: true},
    {file: 'lib/index.mjs', format: 'es', sourcemap: true}
  ]
};
