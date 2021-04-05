/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'umi';
import StylelintPlugin from 'stylelint-webpack-plugin';
import AntdDayjsPlugin from 'antd-dayjs-webpack-plugin';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import packageInfo from '../package.json';

const mode = process.env.mode || 'production';
const envConfig: Record<string, string> = {};
let tmpEnvConfig: Record<string, string> = {};
const envFiles = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
envFiles.forEach((envFile) => {
  const envFilePath = path.resolve(envFile);
  if (fs.existsSync(envFilePath)) {
    tmpEnvConfig = dotenv.parse(fs.readFileSync(envFilePath));
    const keys = Object.keys(tmpEnvConfig);
    keys.forEach((k) => {
      if (k === 'NODE_ENV' || k.startsWith('UMI_APP')) {
        envConfig[k] = tmpEnvConfig[k];
      }
    });
  }
});
envConfig.NODE_ENV = envConfig.NODE_ENV || 'production';

const definePluginOption: Record<string, string> = {};
const keys = Object.keys(envConfig);
keys.forEach((k) => {
  process.env[k] = envConfig[k];
  const v = JSON.stringify(envConfig[k]);
  definePluginOption[k] = v;
  definePluginOption[`process.env.${k}`] = v;
});

export default defineConfig({
  analyze: {
    analyzerMode: 'static',
    openAnalyzer: false,
  },
  antd: {},
  base: process.env.UMI_APP_BASE || '/',
  chainWebpack: (config) => {
    config.plugin('stylelint').use(StylelintPlugin, [
      {
        files: ['src/**/*.{css,less,sass,scss,vue}'],
        fix: true,
      },
    ]);
    config.plugin('antd-dayjs').use(AntdDayjsPlugin);
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              chunks: 'initial',
              name: 'vendors',
              priority: 10,
              test: /[/\\]node_modules[/\\]/,
            },
            antd: {
              name: 'antd',
              priority: 20,
              test: /[/\\]node_modules[/\\]_?(antd|@ant-design)(.*)/,
            },
            ahooks: {
              name: 'ahooks',
              priority: 20,
              test: /[/\\]node_modules[/\\]_?ahooks(.*)/,
            },
            // components: {
            //   minChunks: 2,
            //   name: 'components',
            //   priority: 5,
            //   reuseExistingChunk: true,
            //   test: path.resolve('src', 'components'),
            // },
          },
        },
      },
    });
  },
  chunks: [
    'vendors',
    'antd',
    'ahooks',
    // 'components',
    'umi',
  ],
  cssLoader: {
    localsConvention: 'camelCase',
  },
  cssModulesTypescriptLoader: {
    mode: 'emit',
  },
  define: {
    ...definePluginOption,
  },
  devtool:
    process.env.NODE_ENV === 'production'
      ? 'source-map'
      : 'cheap-module-source-map',
  dynamicImport: {
    loading: '@/Loading',
  },
  dynamicImportSyntax: {},
  favicon: 'favicon.ico',
  fastRefresh: {},
  hash: true,
  layout: {
    navTheme: 'light',
  },
  locale: {
    default: process.env.UMI_APP_I18N_LOCALE,
    antd: true,
    title: true,
  },
  metas: [
    {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge',
    } as Partial<HTMLMetaElement>,
  ],
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  // // TODO: 允许动态切换主题
  // plugins: [],
  proxy: {
    '/api': {
      target: process.env.UMI_APP_REQUEST_BASE_URL || 'https://fake.url',
      changeOrigin: true,
    },
  },
  targets: {
    chrome: 56,
    firefox: 51,
    safari: 10,
    ie: 11,
    android: 6,
    ios: 10,
  },
  title: packageInfo.name,
});
