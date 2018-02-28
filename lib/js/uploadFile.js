//图片上传
//	option = {
//		ele:"#id",//元素选择器
//		callback:function(){//回调函数
//			
//		},
//		type:1,//类型  1是图片 2是视频 3是音乐
//		format:["png","jpg"],//格式限制
//		size:5//文件大小限制,
//		father:"#father" //进度条出现的父级元素,
//		num:5 //上传文件个数限制 少于5个
//	};


function uploadImg(option) {
  var _this = option.ele;
  var data = _this.files, len = data.length;
  if (option.num || option.num == 0) {
    if (option.num < len) return alert("文件个数超过限制");
  }
  if (!data || !data.length) return;
  //判断上传格式
  if (option.format && option.format.length) {
    for (var i = 0; i < len; i++) {
      var format = data[0].name.split('.');
      format = format[format.length - 1];
      var valid = false;
      for (var j = 0, len = option.format.length; j < len; j++) {
        if (format == option.format[j]) {
          valid = true;
          break;
        }
      }
      if (!valid) return alert("只支持" + option.format + "格式文件");
    }

  }
  //判断文件大小
  if (option.size) {
    for (i = 0; i < len; i++) {
      var size = data[i].size / 1000 / 1000;
      if (Number(option.size) < size) return alert("请上传小于" + option.size + "M的文件");
    }

  }

  var $this = $(_this);
  //上传
  var imgFile = new FormData();
  for (var i = 0, len = _this.files.length; i < len; i++) {
    imgFile.append("files", _this.files[i]);
  }
  imgFile.append("type", option.type);
//		imgFile.append("path","12312");

//			是否显示进度条
  if (option.father) {
    var father = option.father;

    if (typeof father == "string") father = $(option.father);
    father.append("<div class='ut-progress-box'><div class='ut-progress-bar'></div></div>");
  }

  /*$.ajaxCustom.post({
   url: '/v3/web/base/fileUpload',
   contentType: false,
   cache: false,
   data: imgFile,
   xhr: function () {
   var myXhr = $.ajaxSettings.xhr();
   if (myXhr.upload && option.father) {
   var father = option.father;
   myXhr.upload.addEventListener("progress", function (e) {
   progressHandlingFunction(e, father)
   }, false);
   }
   return myXhr;
   }
   }).then(function (res) {
   });*/

  NProgress && NProgress.start();
  $.ajax({
    type: 'post',
    url: TxConfig.env.webApi + '/v3/web/base/fileUpload',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('cas-client-st', store.get('tx-st'))
    },
    dataType: 'json',
    data: imgFile,
    success: function (res) {
      NProgress && NProgress.done();
      $(option.ele).val("");
      if (res.success) {
        option.callback(res, $this);
      } else {
        alert(res.msg);
      }

    },
    error: function () {
      $(option.ele).val("");
    },
    xhr: function () {
      var myXhr = $.ajaxSettings.xhr();
      if (myXhr.upload && option.father) {
        var father = option.father;
        myXhr.upload.addEventListener("progress", function (e) {
          progressHandlingFunction(e, father)
        }, false);
      }
      return myXhr;
    },
    cache: false,
    contentType: false,
    processData: false
  });
}
//图片上传相关---进度条
function progressHandlingFunction(e, father) {
  if (e.lengthComputable) {
    var x = ((e.loaded / e.total) * 100).toFixed(2);
    if (x > 98) x = 98;
    x = x + "%";
    if (typeof father == "string") father = $(father);
    father.find(".ut-progress-bar").css("width", x);
  }
}