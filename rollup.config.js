import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
const { version } = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'
const useBabel = process.env.DISABLE_BABEL !== 'yes'

const banner = `/*!
 * maska v${version}
 * (c) 2019-${(new Date()).getFullYear()} Alexander Shabunevich
 * Released under the MIT License.
 */`

const getDistFolder = (fileName = '') => `dist/${useBabel ? '' : 'es6/'}${fileName}`
const makeFileName = (format) => getDistFolder(`maska.${format}.js`)

const makeOutputConfig = (format = true) => {
  return {
    banner,
    format,
    file: makeFileName(format),
    name: 'Maska'
  }
}

const plugins = [
  useBabel && babel({
    exclude: 'node_modules/**'
  }),
  isProduction && terser()
].filter(Boolean)


export default {
  input: 'src/index.js',
  plugins,
  output: [
    {
      ...makeOutputConfig('esm')
    },
    {
      ...makeOutputConfig('umd'),
      exports: 'named',
    },
    {
      ...makeOutputConfig('umd'),
      file: getDistFolder('maska.js'),
      exports: 'named',
    },
  ],
  watch: {
    exclude: 'node_modules/**'
  }
};