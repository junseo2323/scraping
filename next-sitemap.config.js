/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://jscraping.vercel.app', // 반드시 본인의 사이트 URL로
    generateRobotsTxt: true, // robots.txt 생성
    sitemapSize: 7000, // 선택 사항
    changefreq: 'daily',
    priority: 0.7,
    exclude: ['/primary/*'], // 제외할 경로
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' },
      ],
    },
  };
  