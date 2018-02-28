/**
 * Realization:jquery 3d-Rotate Slide 
 * Version:jquery 1.3.1
 */
(function ($) {
    // 创建构造函数
    function Slide(ele, options) {
        this.$ele = $(ele);//this. 构造函数的实例对象
        this.options = $.extend({
            speed: 1000,
            delay: 5000
        }, options);
        //拓展
        this.states = [
            { '&zIndex': 1, width: 200, height: 360, top: 84, left: 480, $opacity: 0.5},
            { '&zIndex': 2, width: 225, height: 398, top: 95, left: 410, $opacity: 0.8},
            { '&zIndex': 3, width: 252, height: 447, top: 75, left: 135, $opacity: 0.9},
            { '&zIndex': 4, width: 338, height: 600, top: 0, left: 431, $opacity: 1},
            { '&zIndex': 3, width: 252, height: 447, top: 58, left: 812, $opacity: 0.9},
            { '&zIndex': 2, width: 225, height: 398, top: 80, left: 710, $opacity: 0.8},
            { '&zIndex': 1, width: 200, height: 360, top: 84, left: 480, $opacity: 0.5}
        ]
        this.lis = this.$ele.find('li');
        this.interval;
        // 点击切换到下一张

        this.$ele.find('section:nth-child(2)').on('click', function () {
            this.stop();
            this.next();
            this.play();
        }.bind(this));
        // 点击切换到上一张
        this.$ele.find('section:nth-child(1)').on('click', function () {
            this.stop();
            this.prev();
            this.play();
        }.bind(this));
        this.move();
        // 让轮播图开始自动播放
        this.play();
    }

    Slide.prototype = {
        // 原型是一个对象，所以写成一个花括号
        // move()方法让轮播图到达states指定的状态
        // <1>当页面打开时将轮播图从中心点展开
        // <2>当轮播图已经展开时，会滚动轮播图(需要翻转states数组中的数据)
        move: function () {
            this.lis.each(function (i, el) {
                $(el)
                    .css('z-index', this.states[i]['&zIndex'])
                    .finish().animate(this.states[i], this.options.speed)
                    // .stop(true,true).animate(states[i], 1000)
                    .find('img').css('opacity', this.states[i].$opacity)
            }.bind(this));
        },
        // 让轮播图切换到下一张
        next: function () {

            this.states.unshift(this.states.pop());
            this.move();
        },
        // 让轮播图滚动到上一张
        prev: function () {

            this.states.push(this.states.shift());
            this.move();
        },
        play: function () {

            this.interval = setInterval(function () {//这个this指window
                // setInterval、setTimeOut 中的this指向window
                // states.unshift(states.pop())       //从后往前走
                // states.push(states.shift())     //从前往后走
                this.next();
            }.bind(this), this.options.delay);
        },
        // 停止自动播放
        stop: function () {
            // var _this = this
            clearInterval(this.interval);
        }

    }
    $.fn.utSlide = function (options) {
        this.each(function (i, ele) {
            new Slide(ele, options);
        })
        return this;
    }
})(jQuery);

$.noConflict();
jQuery('.ut-Slide').utSlide({ speed: 500 });