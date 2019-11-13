module.exports = {
  presets: [
    [
      '@babel/env',
      {
        'useBuiltIns': 'usage',
        "corejs": 3,
        'modules': false,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    [
      'transform-imports',
      {
        'lodash': {
          transform: 'lodash/${member}',
          preventFullImport: false,
        },
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            'modules': 'commonjs',
          },
        ],
      ],
    },
  },
};
