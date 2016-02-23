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
        pause: 3000
    };

    $.fn.vSlider = function(options) {
        // -----------------------------------------------Start of Setting up configures
        var $v = this,
            $i = this.children('.indicator'),
            $n = this.children('.navs'),
            $t = this.children('.thumbnails'),
            $s = $v.children('.slides'),
            inlineSettings = {},
            settings = {},
            slideArray,
            slideInterval;
        inlineSettings.slideWidth = +($v.attr('data-width')) || 0;
        inlineSettings.slideHeight = +($v.attr('data-height')) || 0;
        settings = $.extend(true, defaults, options, inlineSettings);

        if ($s && (slideArray = $s.children('.slide'))) {
            settings.index = 1;
            settings.slideAmount = slideArray.length;
            settings.sliderWidth = settings.slideWidth * (settings.slideAmount + 2);
            settings.sliderHeight = settings.slideHeight;
        } else {
            return;
        }
        console.log(settings);
        var utils = {};

        utils.setSlideSize = function() {
            $s.children('.slide').children('a').children('img').css({ width: settings.slideWidth + 'px', height: settings.slideHeight + 'px' });
        };
        utils.getPosition = function() {
            return settings.position = -(settings.index * settings.slideWidth);
        };
        utils.setPosition = function() {
            $v.attr('style', 'width:' + settings.sliderWidth + 'px; height:' + settings.sliderHeight + 'px; left:' + this.getPosition() + 'px');
        }
        utils.setThumbnail = function() {
            $i.children('li:nth-child(' + settings.index + ')').addClass('active').siblings().removeClass('active');
        };
        utils.setIndicator = function() {
            $i.children('li:nth-child(' + settings.index + ')').addClass('active').siblings().removeClass('active');
        };
        utils.setCss = function() {
            // Setting up slider css
            this.setSlideSize();
            this.setPosition();
            if (settings.indicator) { this.setIndicator(); }
            if (settings.thumbnail) { this.setThumbnail(); }
        };
        utils.count = function() {
            var span = arguments[0] || 1;
            if (span > 0) {
                settings.index = (settings.index + 1) % (settings.slideAmount + 1) || 1;
            } else { //span = -1
                settings.index = (settings.index - 1) % (settings.slideAmount + 1) || settings.slideAmount;
            }
        }
        utils.slides = function() {
            //index++
            this.count();
            this.setCss();
        };
        utils.play = function() {
            slideInterval = setInterval(function() {
                utils.slides();
            }, settings.pause);
        };
        utils.pause = function() {
            clearInterval(slideInterval);
        };
        // -----------------------------------------------End __of Setting up configures

        utils.setCss();
        utils.play();
        // utils.pause();
    };


})(jQuery);
