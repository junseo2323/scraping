// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://jscraping.vercel.app',
  generateRobotsTxt: true,
  exclude: [],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path.startsWith('/article/') ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
