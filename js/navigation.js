document.getElementsByTagName("body")[0].onscroll = function() {
				var hei = document.getElementsByTagName("body")[0].scrollTop
				var headFix = document.getElementById("head-fix");
				var msgLogo = document.getElementById("msg-logo");
				if(hei < 50 || hei==null) {
					headFix.style.cssText="margin-top: 0px;opacity: 1;"
					msgLogo.src = "../img/logo_bai.png";
				}
				if(hei > 120) {
					headFix.style.cssText="margin-top: 0px;background-color: #FFFFFF;opacity: 0.3;box-shadow: 0 0 14px #dddddd;";
					msgLogo.src = "../img/logo.png";
				}
				if(hei > 220) {
					headFix.style.cssText="margin-top: 0px;background-color: #FFFFFF;opacity: 0.5;box-shadow: 0 0 14px #dddddd;"
				}
				if(hei > 300) {
					headFix.style.cssText="margin-top: 0px;background-color: #FFFFFF;opacity: 0.8;box-shadow: 0 0 14px #dddddd;"
				}
				if(hei > 600) {
					headFix.style.cssText="margin-top: 0px;background-color: #FFFFFF;opacity: 1;box-shadow: 0 0 14px #dddddd;"
				}
			}