module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Note: the Reanimated 4 / react-native-worklets Babel plugin is injected
    // automatically by babel-preset-expo, so it must NOT be added here.
  };
};
