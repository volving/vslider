(function($, window, document, undefined) {
    var defaults = {
        loop: true,
        slideWidth: 400,
        slideHeight: 400,
        index: 0,
        slidesNum: 0,
        prev: true,
        next: true,
        indicator: true,
        thumbnail: true,
        thumbnailAmount: 6,
        thumbnailWidth: this.slideWidth / this.thumbnailAmount,
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
            $n = this.children('.navs'),
            $i = this.children('.indicator'),
            $t = this.siblings('.thumbnails'),
            t,
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
        } else {
            return;
        }
        var utils = {};

        utils.calcPosition = function() {
            settings.position = -(settings.index * settings.slideWidth);
            return settings.position;
        };
        utils.setSlideSize = function() {
            $s.children('.slide').children('a').children('img').css({ width: settings.slideWidth + 'px', height: settings.slideHeight + 'px' });
            v.style.width = settings.slideWidth + 'px';
            v.style.height = settings.slideHeight + 'px';
            s.style.width = settings.slidesWidth + 'px';
            s.style.left = utils.calcPosition() + 'px';
        };
        utils.setPosition = function() {
            utils.calcPosition();
            $s.animate({ left: settings.position + 'px' }, settings.speed, 'swing', function() {
                if (settings.index === (settings.slideAmount + 1)) {
                    settings.index = 1;
                } else if (settings.index === 0) {
                    settings.index = settings.slideAmount;
                }

                if (settings.indicator) { utils.setIndicator(); }
                if (settings.thumbnail) { utils.setThumbnail(); }
                s.style.left = utils.calcPosition() + 'px';

            });
        };
        utils.initSlides = function() {
            var first = $s.find('li:first-child').clone();
            var last = $s.find('li:last-child').clone();
            first.appendTo($s);
            last.prependTo($s);
            utils.setSlideSize();

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
        utils.initIndicators = function() {
            $i = $('<ul class="indicators"></ul>');
            var amt = settings.slideAmount;
            if (amt) {

                for (var i = 1; i <= amt; i++) {
                    $i.append('<li class="indicator" data-index="' + i + '"></li>');
                }
                $i.find('.indicator:first-child').addClass('active');
            }
            $s.after($i);
        };
        utils.initThumbnails = function() {
            var shadowWidth = 2,
                shadowWidths = shadowWidth * 2,
                tmp;

            if ($t) {
                settings.thumbnailAmount = parseInt($t.attr('data-amount')) || 6;
                // settings.thumbnailWidth = (settings.slideWidth - settings.thumbnailAmount*(shadowWidth<<1)) / settings.thumbnailAmount;
                settings.thumbnailWidth = (settings.slideWidth / settings.thumbnailAmount) - shadowWidths; //2px for box-shadow
                t = $t[0];
                t.style.width = settings.slideWidth;

                tmp = $t.css({ width: settings.slideWidth }).find('.thumb').css({ width: settings.thumbnailWidth }).css('height');
                $t.css('height', parseInt(tmp) + shadowWidths).find('li').first().addClass('active');
            }
        };
        utils.init = function() {
            utils.initSlides();
            utils.initNavs();
            if (settings.indicator) { utils.initIndicators(); }
            if (settings.thumbnail) { utils.initThumbnails(); }
        };

        utils.setIndicator = function() {
            $i.children('li:nth-child(' + settings.index + ')').addClass('active').siblings().removeClass('active');
        };

        utils.setThumbnail = function() {
            $t.children('li:nth-child(' + settings.index + ')').addClass('active').siblings().removeClass('active');
        };
        utils.countIndex = function(steps) {
            steps = parseInt(steps);
            steps = isFinite(steps) ? steps : 1;
            settings.index = (settings.index + steps) % (settings.slideAmount + 2);

        };
        utils.slides = function() {
            if (clickSemophore) {
                clickSemophore = false;
            } else {
                return;
            }
            utils.countIndex();
            utils.setPosition();
            clickSemophore = true;
        };
        utils.swap = function(steps, jumpTo) {
            if (clickSemophore) {
                clickSemophore = false;
            } else {
                return;
            }
            utils.pause();
            clearTimeout(slideRestartTimeoutId); // restart sliding
            if (jumpTo) {
                settings.index = steps;
            } else {
                utils.countIndex(steps);
            }
            utils.setPosition();
            slideRestartTimeoutId = setTimeout(utils.play, settings.interval);
        };
        utils.prev = function() {
            utils.swap(-1);
        };
        utils.next = function() {
            utils.swap(1);
        };

        utils.navTo = function(index) {
            if (index > 0 && index <= settings.slideAmount) {
                utils.swap(index, true);
            }
        };
        utils.play = function() {
            slideIntervalId = setInterval(function() {
                utils.slides();
            }, settings.pause);
            clickSemophore = true;
        };
        utils.pause = function() {
            clearInterval(slideIntervalId);
        };
        utils.bindEventHandler = function() {
            $s.on('mouseover', utils.pause).on('mouseleave', utils.play);
            if ($prev) {
                $prev.on('click', utils.prev);
            }
            if ($next) {
                $next.on('click', utils.next);
            }
            if ($i) {
                $i.children('.indicator').on('click', function() {
                    var i = parseInt($(this).attr('data-index'));
                    utils.navTo(i);
                });
            }
            if ($t) {
                $t.children('.thumbnail').on('click', function() {
                    var i = parseInt($(this).attr('data-index'));
                    utils.navTo(i);
                });
            }
        };
        // -----------------------------------------------End __of Setting up configures

        utils.init();
        utils.bindEventHandler();
        utils.play();


    };


})(jQuery);
