module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@types': './src/types',
            '@constants': './src/constants',
            '@utils': './src/utils',
            '@contexts': './src/contexts',
          },
        },
      ],
    ],
  };
};
