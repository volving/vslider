(function($, window, document, undefined) {
    var defaults = {
        loop: true,
        slideWidth: 400,
        slideHeight: 400,
        index: 0,
        slidesNum: 0,
        prev: true,
        next: true,
        indecator: true,
        thumbnail: true,
        magnifier: false,
        autoPlay: true,
        slideAnimation: '',
        pause: 5000,
        speed: 250,
        interval: 10, // in ms
        rate: 25 // rate = speed / interval
    };

    $.fn.vSlider = function(options) {
        // -----------------------------------------------Start of Setting up configures
        var $v = this,
            v = $v[0],
            $s = $v.children('.slides'),
            s = $s[0],
            $i = this.children('.indicator'),
            $n = this.children('.navs'),
            $t = this.children('.thumbnails'),
            inlineSettings = {},
            settings = {},
            slideArray,
            slideInterval,
            clickSemophore = true;
        inlineSettings.slideWidth = +($v.attr('data-width')) || 0;
        inlineSettings.slideHeight = +($v.attr('data-height')) || 0;
        settings = $.extend(true, defaults, options, inlineSettings);

        if ($s && (slideArray = $s.children('.slide'))) { //calc basic settings
            settings.index = 1;
            settings.slideAmount = slideArray.length;
            settings.sliderWidth = settings.slideWidth * (settings.slideAmount + 2);
            settings.sliderHeight = settings.slideHeight;
            settings.slideSpan = settings.slideWidth / settings.rate;
        } else {
            return;
        }
        var utils = {};

        utils.calcPosition = function() {
            return settings.position = -(settings.index * settings.slideWidth);
        };
        utils.setSlideSize = function() {
            $s.children('.slide').children('a').children('img').css({ width: settings.slideWidth + 'px', height: settings.slideHeight + 'px' });
            v.style.width = settings.sliderWidth + 'px';
            v.style.left = this.calcPosition() + 'px';
        };
        utils.setPosition = function() {
            // $v.attr('style', 'width:' + settings.sliderWidth + 'px; height:' + settings.sliderHeight + 'px; left:' + this.getPosition() + 'px');
            this.calcPosition();
            var currentPosition = parseInt(v.style.left);
            var slideSpan = (currentPosition < settings.position) ? settings.slideSpan : -(settings.slideSpan);
            console.log('currentPosition:', currentPosition, '\nslideSpan:', slideSpan, '\nsettings.position:', settings.position);
            // var slide_animate = function() {
            //     if (currentPosition === settings.position) {
            //         clickSemophore = true;
            //         return;
            //     } else {
            //         currentPosition += slideSpan;
            //         v.style.left = currentPosition + 'px';
            //         setTimeout(slide_animate, settings.interval);
            //     }
            // };
            // slide_animate();
            $v.animate({left: settings.position}, settings.speed, 'swing');

        };
        utils.setThumbnail = function() {
            $i.children('li:nth-child(' + settings.index + ')').addClass('active').siblings().removeClass('active');
        };
        utils.setIndicator = function() {
            $i.children('li:nth-child(' + settings.index + ')').addClass('active').siblings().removeClass('active');
        };
        utils.initSlides = function() {
            var first = $s.find('li:first-child').clone()
            var last = $s.find('li:last-child').clone()
            first.appendTo($s);
            last.prependTo($s);
            this.setSlideSize();

        };
        utils.initIndicators = function() {

        };
        utils.initNavs = function() {

        };
        utils.initThumbnails = function() {

        };
        utils.init = function() {
            this.initSlides();
            this.initNavs();
            if (settings.indicator) { this.initIndicators(); }
            if (settings.thumbnail) { this.initThumbnails(); }

        };
        utils.setCss = function() {
            this.setPosition();
            if (settings.indicator) { this.setIndicator(); }
            if (settings.thumbnail) { this.setThumbnail(); }
        };
        // prev / next
        utils.count = function() {
            var span = arguments[0] || 1;
            if (span > 0) {
                settings.index = (settings.index + 1) % (settings.slideAmount + 1) || 1;
            } else { //span = -1
                settings.index = (settings.index - 1) % (settings.slideAmount + 1) || settings.slideAmount;
            }

        }
        utils.slides = function() {
            clickSemophore = false;
            this.count();
            this.setCss();
        };
        utils.jump = function() {

        }
        utils.play = function() {
            slideInterval = setInterval(function() {
                utils.slides();
            }, settings.pause);
        };
        utils.pause = function() {
            clearInterval(slideInterval);
        };
        // -----------------------------------------------End __of Setting up configures
        utils.init();
        utils.play();
        // utils.pause();
    };


})(jQuery);
