/* eslint-disable no-template-curly-in-string */

module.exports = {
  presets: [['next/babel']],
  plugins: [
    [
      'babel-plugin-transform-imports',
      {
        lodash: {
          transform: 'lodash/${member}',
          preventFullImport: true,
        },
        '@material-ui/core': {
          transform: '@material-ui/core/${member}',
          preventFullImport: true,
        },
        '@material-ui/icons': {
          transform: '@material-ui/icons/${member}',
          preventFullImport: true,
        },
        '@onextech/gvs-kit/core': {
          transform: '@onextech/gvs-kit/core/${member}',
          preventFullImport: true,
        },
      },
    ],
  ],
}
