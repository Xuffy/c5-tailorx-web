function uploadImg(e){var r=e.ele,t=r.files,a=t.length;if((e.num||0==e.num)&&e.num<a)return alert("文件个数超过限制");if(t&&t.length){if(e.format&&e.format.length)for(var s=0;a>s;s++){var n=t[0].name.split(".");n=n[n.length-1];for(var o=!1,i=0,a=e.format.length;a>i;i++)if(n==e.format[i]){o=!0;break}if(!o)return alert("只支持"+e.format+"格式文件")}if(e.size)for(s=0;a>s;s++){var f=t[s].size/1e3/1e3;if(Number(e.size)<f)return alert("请上传小于"+e.size+"M的文件")}for(var l=$(r),p=new FormData,s=0,a=r.files.length;a>s;s++)p.append("files",r.files[s]);if(p.append("type",e.type),e.father){var u=e.father;"string"==typeof u&&(u=$(e.father)),u.append("<div class='ut-progress-box'><div class='ut-progress-bar'></div></div>")}NProgress&&NProgress.start(),$.ajax({type:"post",url:TxConfig.env.webApi+"/v3/web/base/fileUpload",beforeSend:function(e){e.setRequestHeader("cas-client-st",store.get("tx-st"))},dataType:"json",data:p,success:function(r){NProgress&&NProgress.done(),$(e.ele).val(""),r.success?e.callback(r,l):alert(r.msg)},error:function(){$(e.ele).val("")},xhr:function(){var r=$.ajaxSettings.xhr();if(r.upload&&e.father){var t=e.father;r.upload.addEventListener("progress",function(e){progressHandlingFunction(e,t)},!1)}return r},cache:!1,contentType:!1,processData:!1})}}function progressHandlingFunction(e,r){if(e.lengthComputable){var t=(e.loaded/e.total*100).toFixed(2);t>98&&(t=98),t+="%","string"==typeof r&&(r=$(r)),r.find(".ut-progress-bar").css("width",t)}}