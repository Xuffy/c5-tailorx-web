!function(t){function i(i,e){this.$ele=t(i),this.options=t.extend({speed:1e3,delay:5e3},e),this.states=[{"&zIndex":1,width:200,height:360,top:84,left:480,$opacity:.5},{"&zIndex":2,width:225,height:398,top:95,left:410,$opacity:.8},{"&zIndex":3,width:252,height:447,top:75,left:135,$opacity:.9},{"&zIndex":4,width:338,height:600,top:0,left:431,$opacity:1},{"&zIndex":3,width:252,height:447,top:58,left:812,$opacity:.9},{"&zIndex":2,width:225,height:398,top:80,left:710,$opacity:.8},{"&zIndex":1,width:200,height:360,top:84,left:480,$opacity:.5}],this.lis=this.$ele.find("li"),this.interval,this.$ele.find("section:nth-child(2)").on("click",function(){this.stop(),this.next(),this.play()}.bind(this)),this.$ele.find("section:nth-child(1)").on("click",function(){this.stop(),this.prev(),this.play()}.bind(this)),this.move(),this.play()}i.prototype={move:function(){this.lis.each(function(i,e){t(e).css("z-index",this.states[i]["&zIndex"]).finish().animate(this.states[i],this.options.speed).find("img").css("opacity",this.states[i].$opacity)}.bind(this))},next:function(){this.states.unshift(this.states.pop()),this.move()},prev:function(){this.states.push(this.states.shift()),this.move()},play:function(){this.interval=setInterval(function(){this.next()}.bind(this),this.options.delay)},stop:function(){clearInterval(this.interval)}},t.fn.utSlide=function(t){return this.each(function(e,s){new i(s,t)}),this}}(jQuery),$.noConflict(),jQuery(".ut-Slide").utSlide({speed:500});