'use strict';

__inline('../lib/js/jquery-1.10.2.min.js');
__inline('../lib/js/underscore-min.js');
__inline('../lib/js/store.legacy.min.js');
__inline('../lib/js/nprogress.js');
__inline('../lib/layer/layer.js');
__inline('../js/config.js');

/**
 * 通用函数
 */
(function ($) {
  var _ajax = {};

  /**
   * 字符串拼接
   * @param args
   * @returns {*}
   */
  String.prototype.format = function (args) {
    if (arguments.length > 0) {
      var result = this;
      if (arguments.length == 1 && typeof (args) == "object") {
        for (var key in args) {
          result = result.replace(new RegExp("({" + key + "})", "g"), args[key]);
        }
      }
      else {
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] == undefined) {
            return "";
          }
          else {
            var reg = new RegExp("({[" + i + "]})", "g");
            result = result.replace(reg, arguments[i]);
          }
        }
      }
      return result;
    }
    else {
      return this;
    }
  };

  /**
   * 阿里OSS图片服务参数设置
   * @param url      string   'http://...'
   * @param params   string   'crop,w_240,h_180'
   * ps: oss api url
   * https://help.aliyun.com/document_detail/44705.html?spm=5176.doc44957.6.957.JQrRmS
   */
  function ossImage(url, params) {
    if (!url || url.indexOf('tailorx.cn') < 0) {
      return url;
    }

    url += url.indexOf('?') > -1 ? '&' : '?';
    return url + 'x-oss-process=image/' + params;
  }


  /**
   * 获取地址参数
   * @param name
   * @returns {null}
   */
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
  }

  /**
   * GET请求
   * @param params
   * @param config
   */
  _ajax.get = function (params, config) {
    params.type = 'GET';
    return http(params, config);
  };

  /**
   * put请求
   * @param params
   * @param config
   */
  _ajax.put = function (params, config) {
    params.type = 'put';
    if (_.isUndefined(params.contentType)) {
      params.contentType = 'application/x-www-form-urlencoded';
    }
    return http(params, config);
  };

  /**
   * POST请求
   * @param params
   * @param config
   */
  _ajax.post = function (params, config) {
    params.type = 'POST';
    if (_.isUndefined(params.contentType)) {
      params.contentType = 'application/x-www-form-urlencoded';
    }
    return http(params, config);
  };


  /**
   * 自定义AJAX请求，过滤参数，返回验证
   * @param params 接口参数：
   * @param config
   * @returns {*}
   */
  function http(params, config) {
    var st = store.get('tx-st');
    NProgress.start();

    config = _.extend({
      base: '' // 设置请求路径
    }, config);

    params.url = (config.base || TxConfig.env.webApi) + params.url;

    params.dataType = 'json';
    params.contentType = _.isUndefined(params.contentType) ? 'application/json' : params.contentType;
    params.timeout = params.timeout || 20000;


    if (!st && !config.noLogin) {
      TxMain.event.login(0);
      throw new Error('ST of undefined');
    }

    if(!config.noLogin){
      params.headers = {'cas-client-st': st};
    }


    // 数据返回
    return $.ajax(params)
      .error(function (e) {
        NProgress.done();
        if (e.status !== 200) {
          throw new Error('api error state - {0} {1}'.format(e.status || '000', params.url));
        }


      })
      .then(function (data) {
        NProgress.done();
        if (_.isEmpty(data)) {
          throw new Error('api no return value {0}'.format(params.url));
        }

        /*if (data.code !== '200') {
         alert(data.msg);
         throw new Error('api error');
         }*/

        return data;
      });
  }


  $.extend({
    ossImage: ossImage,
    http: _ajax,
    getUrlParam: getUrlParam
  });
})($);

/**
 * 基础接口调用
 */
(function () {
  var tm = {};

  $(function () {


    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };

    tm.init.user();
    tm.init.event();
    tm.init.header();

  });

  tm.device = function () {
    var ua = navigator.userAgent,
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua),
      isFireFox = /(?:Firefox)/.test(ua),
      isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
      isPhone = /(?:iPhone)/.test(ua) && !isTablet,
      isPc = !isPhone && !isAndroid && !isSymbian;
    return {
      isTablet: isTablet,
      isPhone: isPhone,
      isAndroid: isAndroid,
      isPc: isPc
    };
  };

  tm.init = {
    event: function () {
      $('#go-joinStep').on('click', tm.event.checkJoinStep);

      $('.tx-header .login h4').on('click', function () {
        tm.event.login(0);
      });

      $('.tx-header .login h3').on('click', function () {
        tm.event.login(1);
      });
    },
    user: function () {
      var user = store.get('tx-user') || {}
        , userEl = $('.tx-header .login');

      if (!_.isEmpty(user)) {
        userEl.addClass('success');
        userEl.find('.user-img').css({'background-image': 'url(' + user.photo + ')'});
        userEl.find('.user-name').text('Hi，{0}'.format(user.realName || '用户'));
      }
      userEl.removeClass('tx-hide');
    },
    joinStep: function () {
      var user = store.get('tx-user') || {};
      return $.http.get({
        url: '/v3/web/certigier/getByUserId/{0}'.format(user.userId),
        contentType: 'application/x-www-form-urlencoded'
      }).then(function (res) {
        store.set('tx-join-step', res.data);
      });
    },
    header: function () {
      var cityTpl = '<ul><li onclick="window.location.href = \'/view/store-list.html?id={{province}}\'">{{province}}</li></ul>';
      $.get(TxConfig.env.headUrl + '/web/listStoreName', {city: ''})
        .then(function (res) {
          res = JSON.parse(res);
          if (res.code !== '200') {
            throw new Error('接口请求异常 - findStoreList');
          }
          return res.data;
        })
        .then(function (data) {
          var cityEle = $('.tx-header .store .child-menu')
            , cTpl = _.template(cityTpl);
          _.map(data, function (val) {
            var ce = $(cTpl(val));
            _.map(val.storeNames, function (sVal) {
              ce.append('<li onclick="window.location.href = \'/view/store-detail.html?id=' + sVal.id + '\'">' + sVal.name + '</li>')
            });
            cityEle.append(ce);
          });
          $('.index-header').addClass('show');
        });
    },
    headerTo: function (index) {
      $('.tx-header .menu > li').removeClass('active').eq(index - 1).addClass('active');
    }
  };

  tm.event = {
    checkJoinStep: function () {
      var step = store.get('tx-join-step') || {};

      if (_.isEmpty(step) || step.status === 5) {
        if (window.location.pathname.indexOf('join-stop-1.html') < 0) {
          window.location.href = '../view/join-stop-1.html';
        }
      } else if (step.status === 0 || step.status === 4) {
        if (window.location.pathname.indexOf('join-stop-2.html') < 0) {
          window.location.href = '../view/join-stop-2.html';
        }
      } else if (step.status === 1 || step.status === 3 || step.status === 4) {
        if (window.location.pathname.indexOf('join-stop-3.html') < 0) {
          window.location.href = '../view/join-stop-3.html';
        }
      } else if (step.status === 2) {
        if (window.location.pathname.indexOf('join-stop-4.html') < 0) {
          window.location.href = '../view/join-stop-4.html';
        }
      }

    },
    login: function (directType, redirectUrl) {
      var el = $('.tx-login')
        , user = store.get('tx-user')
        , iframe = ''
        , url = '{api}/v3/web/user/authorize?directType={type}&redirectUrl={rUrl}'.format({
        api: TxConfig.env.webApi,
        type: directType || 0,
        rUrl: encodeURIComponent('{0}/view/login-authorize.html'.format(window.location.origin))
      });

      if (!_.isEmpty(user)) {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
        return;
      }

      if (redirectUrl) {
        store.set('tx-redirect-url', redirectUrl);
      }

      if (!el.length) {
        el = $('<div class="tx-login"><div class="box"><div class="tx-loading"></div><iframe></iframe></div></div>');
        el.find('iframe').attr('src', url);
        $('body').append(el);
        el.on('click', function () {
          $(this).removeClass('show');
        });
        el.addClass('show');
      } else {
        el.find('iframe').attr('src', url);
        el.addClass('show');
      }
      iframe = el.find('iframe');
      if (iframe[0].attachEvent) {
        iframe[0].attachEvent("onload", function () {
          iframe.addClass('show');
        });
      } else {
        iframe[0].onload = function () {
          iframe.addClass('show');
        };
      }

    },
    logout: function () {
      layer.confirm('您确定要退出登录吗？', {
        shadeClose: true,
        btn: ['确定', '取消'] //按钮
      }, function () {
        localStorage.clear();
        sessionStorage.clear();
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }

        window.location.href = '/';
      });
    }
  };


  window.TxMain = tm;
})();