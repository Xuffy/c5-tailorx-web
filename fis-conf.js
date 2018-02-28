'use strict';


fis.hook('relative');

fis
  .match('**', {relative: true})
  .set('project.ignore', ['live/**', '.git/**', '.idea/**', 'fis-conf.js', 'dist/**', 'README.md', 'package.json', 'node_modules/**'])
  .match('**.css', {
    preprocessor: fis.plugin('autoprefixer', { // 自动生成CSS3兼容前缀
      "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
      "cascade": true
    })
  })
  .match('**.js', {
    preprocessor: [
      fis.plugin('js-require-css')
    ]
  });

// 本地环境
fis
  .media('local')
  .match('*', {
    deploy: [
      fis.plugin('replace', {
        from: '__fis.env',
        to: 'local'
      }),
      fis.plugin('local-deliver', {
        to: './live'
      })
    ]
  });

// 发布测试环境
fis
  .media('dev')
  .set('project.ignore', ['live/**', 'fis-conf.js', 'dist/**', 'README.md', 'package.json', 'node_modules/**', '/src/mock/**'])
  .match('*.js', {
    optimizer: fis.plugin('uglify-js')
  })
  .match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
  })
  .match('*.css', {optimizer: fis.plugin('clean-css')})
  .match('*', {
    deploy: [
      fis.plugin('replace', {
        from: '__fis.env',
        to: 'develop'
      }),
      fis.plugin('local-deliver', {
        to: './dist'
      })
    ]
  });


// 发布测试环境
fis
  .media('test')
  .set('project.ignore', ['live/**', 'fis-conf.js', 'dist/**', 'README.md', 'package.json', 'node_modules/**', '/src/mock/**'])
  .match('*.js', {
    optimizer: fis.plugin('uglify-js')
  })
  .match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
  })
  .match('*.css', {optimizer: fis.plugin('clean-css')})
  .match('*', {
    deploy: [
      fis.plugin('replace', {
        from: '__fis.env',
        to: 'test'
      }),
      fis.plugin('local-deliver', {
        to: './dist'
      })
    ]
  });

// 发布到线上环境
fis
  .media('pro')
  .set('project.ignore', ['live/**', 'fis-conf.js', 'dist/**', 'README.md', 'package.json', 'node_modules/**', '/src/mock/**'])
  .match('*.js', {
    optimizer: fis.plugin('uglify-js')
  })
  .match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
  })
  .match('*.css', {optimizer: fis.plugin('clean-css')})
  .match('*', {
    deploy: [
      fis.plugin('replace', {
        from: '__fis.env',
        to: 'production'
      }),
      fis.plugin('local-deliver', {
        to: './dist'
      })
    ]
  });