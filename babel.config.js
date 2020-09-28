// babel.config.js
module.exports = (api) => {
  const isTest = api.env('test')
  const isDev = api.env('development')

  // You can use isTest to determine what presets and plugins to use.

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'cjs' : false,
          useBuiltIns: 'usage',
          corejs: 3,
          loose: false
        }
      ],
      [
        '@babel/typescript',
        {
          allExtensions: true,
          isTSX: true
        }
      ]
    ],
    plugins: [
      [ '@babel/plugin-transform-runtime', { corejs: false }]
    ]
  }
}
