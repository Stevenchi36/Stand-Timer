// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      'space-in-parens': ['error', 'always'],
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true } ],
      'semi': ['error', 'always'],
      'comma-dangle': [2, 'always-multiline'],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 1,
      'vue/html-indent': [
        'error',
        2,
        {
          'attribute': 1,
          'closeBracket': 1,
          'alignAttributesVertically': false,
          'ignores': [],
        },
      ],
    },
  },
);
