import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true },
    { file: pkg.module, format: 'es', exports: 'named', sourcemap: true },
  ],
  plugins: [
    del({ targets: 'dist' }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          types: [],
          lib: ['ES5', 'DOM', 'ES2015.Promise'],
        },
        exclude: ['src/tests'],
      },
    }),
    terser(),
  ],
  external: ['@huolala-tech/custom-error'],
};
