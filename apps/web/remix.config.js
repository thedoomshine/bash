/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  server: process.env['NODE_ENV'] === 'development' ? undefined : './server.ts',
  serverBuildPath: 'api/index.js',
  // appDirectory: 'app',
  // assetsBuildDirectory: 'public/build',
  // publicPath: '/build/',
  serverModuleFormat: 'cjs',
  watchPaths: async () => [
    '../../packages/diary-design-system/dist/index.d.ts',
  ],
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
}
