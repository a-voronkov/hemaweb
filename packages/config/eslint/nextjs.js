module.exports = {
  extends: ['next/core-web-vitals', './base.js'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};

