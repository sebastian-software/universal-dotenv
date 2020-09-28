// babel.config.js
module.exports = (api) => {
  const isTest = api.env('test')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'cjs' : false,
          useBuiltIns: 'usage',
          corejs: 3,
          loose: false,
          targets: {
            node: 10
          }
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
