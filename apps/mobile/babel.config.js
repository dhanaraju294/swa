module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Must always be listed last.
    plugins: ['react-native-reanimated/plugin'],
  };
};
