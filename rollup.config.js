import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import less from 'rollup-plugin-less';
// rollup.config.js
export default {
  input: 'js/components/widget-cookie-policy/drc-cookie-policy.js',
  output: {
    file: 'js/components/widget-cookie-policy/cookie-policy.js',
    format: 'amd',
    amd: {
      id: 'cookie-policy',
      define: 'window.define'
    }
  },
  plugins: [
    less({
      insert: true,
      output: 'js/components/widget-cookie-policy/cookie-policy.inject.css',
      exclude: []
    }),
    resolve(),
    commonjs()
  ]
};
