/* eslint-disable import/no-extraneous-dependencies */
const config = require('@modyqyw/fabric/prettier');

module.exports = {
  ...config,
  // write your own rules here
  overrides: [
    ...config.overrides,
    // // write your own overrides here
    {
      files: ['*.css', '*.less', '*.sass', '*.scss'],
      options: {
        // sometimes you may want a longer line
        printWidth: 160,
      },
    },
  ],
};
