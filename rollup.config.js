import autoExternal from 'rollup-plugin-auto-external';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['@form8ion', {targets: {node: '12.20'}, modules: false}]]
    }),
    nodeResolve({mainFields: ['module']})
  ],
  output: [
    {file: 'lib/index.js', format: 'cjs', sourcemap: true},
    {file: 'lib/index.mjs', format: 'es', sourcemap: true}
  ]
};
