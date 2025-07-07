import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'lib',
        format: 'cjs',
        entryFileNames: 'a-small-promise-queue.cjs.js',
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: 'lib',
        format: 'esm',
        entryFileNames: 'a-small-promise-queue.esm.mjs',
        exports: 'named',
        sourcemap: true,
      }
    ],
    plugins: [resolve(), commonjs(), typescript({ module: "ESNext", tsconfig: './tsconfig.json'})],
  },
  {
    input: './src/index.ts',
    output: [
      {
        exports: 'named',
        dir: 'lib',
        format: 'umd',
        entryFileNames: 'a-small-promise-queue.umd.js',
        name: 'QueueTool',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [resolve(), commonjs(), typescript({ module: "ESNext"})],
  }
]

