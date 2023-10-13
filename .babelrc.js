module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@constants': './constants/*',
          '@config': './config',
          '@controllers': './controllers',
          '@data': './data',
          '@helpers': './helpers',
          '@middleware': './middleware',
          '@model': './model',
          '@public': './public',
          '@routes': './routes',
          '@seeders': './seeders',
          '@services': './services',
          '@utils': './utils/*',
          '@views': './views',
        },
      },
    ],
  ],
};
