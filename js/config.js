(function () {
  window.TxConfig = {
    env: {
      local: {
        // headUrl: 'http://192.168.11.215:30701',
        headUrl: 'http://www.tailorx.cn/api',
        // webApi: 'http://192.168.11.215:30701'
        webApi: 'http://www.tailorx.cn/web'
      },
      develop: {
        headUrl: 'http://www.dev.tailorx.cn/api',
        webApi: 'http://www.dev.tailorx.cn/web'
      },
      test: {
        headUrl: 'http://www.test.tailorx.cn/api',
        webApi: 'http://www.test.tailorx.cn/web'
        // webApi: 'http://192.168.11.215:30701',
        // webApi: 'http://192.168.11.215:30701'
      },
      production: {
        headUrl: 'http://www.tailorx.cn/api',
        webApi: 'http://www.tailorx.cn/web'
      }
    }['__fis.env']
  }
})();

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
}