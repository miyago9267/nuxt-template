// Nuxt 4 ESLint config
// Nuxt 4 ESLint config – tailored to Miyago's style (TS uses tabs, semicolons, relaxed Vue rules)
import { createConfigForNuxt } from '@nuxt/eslint-config'
import globals from 'globals'
import jestPlugin from 'eslint-plugin-jest'

export default createConfigForNuxt(
  {
    features: {
      stylistic: true, // keep base rules, override below
    },
  },
  {
    name: 'public/rules',
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.mocha,
        $: 'writable',
        _: 'writable',
        Vue: 'writable',
        alertify: 'writable',
        axios: 'writable',
        route: 'writable',
        cy: 'writable',
        Cypress: 'writable',
        expect: 'writable',
        assert: 'writable',
      },
    },
    rules: {
      'no-console': 'error',
      'no-alert': 'off',
      'no-bitwise': 'off',
      camelcase: 'error',
      curly: 'error',
      eqeqeq: 'off',
      'no-eq-null': 'error',
      'no-empty': 'error',
      'brace-style': 'error',
      'comma-spacing': 'error',
      'comma-style': 'error',
      indent: ['error', 2],
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'arrow-spacing': 'error',
      'no-spaced-func': 'error',
      'space-before-function-paren': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'unicode-bom': 'error',
      'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
      'vue/html-indent': ['error', 2],
      'vue/multi-word-component-names': 'off',
      'vue/space-infix-ops': 'error',
      'vue/comma-spacing': 'error',
      'vue/space-in-parens': 'error',
      'vue/template-curly-spacing': 'error',
      'vue/singleline-html-element-content-newline': [
        'error',
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ['pre', 'a', 'b', 'span', 'i', 'label', 'small', 'svg', 'td'],
        },
      ],
    },
  },
)
