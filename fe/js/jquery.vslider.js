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
        pause: 3000,
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
            slideIntervalId,
            slideRestartTimeoutId,
            clickSemophore = true,
            $prev,
            $next;
        inlineSettings.slideWidth = parseInt($v.attr('data-width')) || 0;
        inlineSettings.slideHeight = parseInt($v.attr('data-height')) || 0;
        settings = $.extend(true, defaults, options, inlineSettings);

        if ($s && (slideArray = $s.children('.slide'))) { //calc basic settings
            settings.index = 1;
            settings.slideAmount = slideArray.length;
            settings.slidesWidth = settings.slideWidth * (settings.slideAmount + 2);
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
            v.style.width = settings.slideWidth + 'px';
            s.style.width = settings.slidesWidth + 'px';
            s.style.left = this.calcPosition() + 'px';
        };
        utils.setPosition = function() {
            this.calcPosition();
            $s.animate({ left: settings.position + 'px' }, settings.speed, 'swing', function() {
                if (settings.index === (settings.slideAmount + 1)) {
                    settings.index = 1;
                } else if (settings.index === 0) {
                    settings.index = settings.slideAmount;
                }
                s.style.left = utils.calcPosition() + 'px';
            });
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
            var $navs = $('<div class="navs"><a href="#"><span class="prev">&lt;</span></a><a href="#"><span class="next">&gt;</span></a></div>');
            if (!$n || 0 === $n.length) {
                $n = $navs;
                $s.after($n);
            }
            $prev = $navs.find('.prev');
            $next = $navs.find('.next');

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
        utils.countIndex = function(steps) {
            steps = parseInt(steps);
            steps = isFinite(steps) ? steps : 1;
            settings.index = (settings.index + steps) % (settings.slideAmount + 2);

        };
        utils.slides = function() {
            // clickSemophore ? clickSemophore = false : return;
            if (clickSemophore) {
                clickSemophore = false;
            } else {
                return;
            }
            this.countIndex();
            this.setCss();
            clickSemophore = true;
        };
        utils.swap = function(steps) {
            if (clickSemophore) {
                clickSemophore = false;
            } else {
                return;
            }
            utils.pause();
            clearTimeout(slideRestartTimeoutId);// restart sliding
            console.log('settings.index:', settings.index, steps);
            this.countIndex(steps);
            this.setCss();
            slideRestartTimeoutId = setTimeout(utils.play, settings.interval);
        };
        utils.prev = function() {
            utils.swap(-1);
        };
        utils.next = function() {
            utils.swap(1);
        };
        utils.play = function() {
            slideIntervalID = setInterval(function() {
                utils.slides();
            }, settings.pause);
            clickSemophore = true;
        };
        utils.pause = function() {
            clearInterval(slideIntervalID);
        };
        utils.bindEventHandler = function() {
            $s.on('mouseover', utils.pause).on('mouseleave', utils.play);
            if ($prev) {
                $prev.on('click', utils.prev);
            }
            if ($next) {
                $next.on('click', utils.next);
            }
        };
        // -----------------------------------------------End __of Setting up configures

        utils.init();
        utils.bindEventHandler();
        utils.play();


    };


})(jQuery);
