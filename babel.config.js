module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        jsxImportSource: 'react',
      }]
    ],
    plugins: [
      function () {
        return {
          visitor: {
            MetaProperty(path) {
              path.replaceWithSourceString('process');
            }
          }
        };
      }
    ]
  };
};