
module.exports = {
    webpack(config, { isServer }) {
      // 서버사이드에서만 re2.node를 로드
      if (isServer) {
        config.module.rules.push({
          test: /re2\.node$/,
          use: 'node-loader', // node-loader를 사용하여 해당 파일을 로드하도록 설정
        });
      } else {
        // 클라이언트에서는 `re2.node`를 무시하도록 설정
        config.module.rules.push({
          test: /re2\.node$/,
          loader: 'ignore-loader',
        });
      }
      return config;
    },
    distDir: 'build',
    experimental: {
      // This is experimental but can
      // be enabled to allow parallel threads
      // with nextjs automatic static generation
      workerThreads: false,
      cpus: 4
    }
  
  };
  