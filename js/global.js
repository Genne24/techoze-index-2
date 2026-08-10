'use strict';
$.cookie = function(key, value, options) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
        options = $.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days)
        }
        value = String(value);
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''))
    }
    options = value || {};
    var decode = options.raw ? function(s) {
        return s
    } : decodeURIComponent;
    var pairs = document.cookie.split('; ');
    for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
        if (decode(pair[0]) === key) return decode(pair[1] || '')
    }
    return null
}
if ((typeof Shopify) === 'undefined') {
    Shopify = {};
}
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);
        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');
            if (isNaN(number) || number == null) {
                return 0;
            }
            number = (number / 100.0).toFixed(precision);
            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';
            return dollars + cents;
        }
        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}
window.novtheme = window.novtheme || {};
if ($('html').hasClass('lang-rtl')) {
    var rtl = true;
} else {
    var rtl = false;
}
var body = $('body'),
    sidebarOverlay = $(".sidebar-overlay"),
    currentWidth = $(window).width(),
    responsive_mobile = currentWidth < 768,
    isClickEventAttached = false,
    searchCanvas = $('.nov-search__canvas'),
    blockAutoComplete = $('.search_autocomplete'),
    show_rating = theme.show_rating;
novtheme.init = function() {
    novtheme.toggleMobileStyles();
    novtheme.eventBlockCart();
    novtheme.ProductDetail();
    novtheme.VerticalThumbnailProductDetail();
    novtheme.ThumbnailProductDetail();
    novtheme.NovTogglePage();
    novtheme.Countdown();
    novtheme.goToTop();
    novtheme.MenuSidebar();
    novtheme.SearchAutoComplete();
    novtheme.tooltip();
    novtheme.Nov_iframe_video();
    novtheme.LoadmoreByButton();
    novtheme.Mainmenu();
    novtheme.CollectionPage();
    novtheme.CollectionPageLoadmore();
    novtheme.NovAccordion();
    novtheme.ObserverActive();
    novtheme.LookBook();
    novtheme.ProductBundle();
    novtheme.LanguageCountry();
    novtheme.CartExtent();
    novtheme.AddActive();
    novtheme.Header_mobile();
    novtheme.Copy();
    novtheme.StickyHeader();
    novtheme.ParallaxImage();
    novtheme.ParallaxImageScrollHorizontal();
    novtheme.CollectionTab();
    novtheme.NumberAnimate();
    novtheme.FakeOrder();
    novtheme.VerticalMenu();
    novtheme.OverlayBlur();
    novtheme.ToggleUpDown();
    novtheme.Comparisons();
    novtheme.Marquee();
    novtheme.TextAnimate();
    novtheme.ElementHeight();
    novtheme.ImageSplitWithText();
    novtheme.ProgressBar();
    // novtheme.CustomWow();
    novtheme.NovMobileMenu();
    novtheme.NovImageLink();
    novtheme.ScrollView();
    novtheme.PageMenuService();
}; 
//Tooltip, activated by hover event
novtheme.tooltip = function() {
    body.tooltip({
        selector: "[data-toggle='tooltip']",
        container: "body"
    });
};
novtheme.swapChildren = function(obj1, obj2) {
    var temp = obj2.children().detach();
    obj2.empty().append(obj1.children().detach());
    obj1.append(temp);
};
novtheme.toggleMobileStyles = function() {
    if (responsive_mobile) {
        $("*[id^='_desktop_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_desktop_', '_mobile_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[id^='_mobile_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_mobile_', '_desktop_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
};
novtheme.toggleSticky = function(action) {
    if (action == true) {
        $("*[class^='contentsticky_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentsticky_', 'contentstickynew_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[class^='contentstickynew_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentstickynew_', 'contentsticky_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
};
novtheme.StickyHeader = function() {
    const $siteHeader = $('.site-header');
    if ($siteHeader.hasClass('sticky-header')) {
        let isHeaderSticky = false;
        let prevScroll = $(window).scrollTop();
        const headerHeight = $siteHeader.outerHeight();
        const threshold = 10;

        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            
            if (Math.abs(scrollTop - prevScroll) < threshold) {
                prevScroll = scrollTop;
                return;
            }

            if (scrollTop < prevScroll && scrollTop > headerHeight) {
                if (!isHeaderSticky) {
                    $('#header-sticky').addClass('sticky-header-active');
                    $siteHeader.css('height', headerHeight);
                    novtheme.toggleSticky(true);
                    isHeaderSticky = true;
                }
            } else {
                if (isHeaderSticky) {
                    $('#header-sticky').removeClass('sticky-header-active');
                    $siteHeader.css('height', 'auto');
                    novtheme.toggleSticky(false);
                    isHeaderSticky = false;
                }
            }
            prevScroll = scrollTop;
        });
    }
};
novtheme.Header_mobile = function() {
    var mobileMenu = $('#mobile_menu'),
        mobilesearch = $('#mobile_search'),
        showMegamenu = $('#show-megamenu'),
        mobileBtnSearch = $('.mobile-btn_search');
    showMegamenu.click(function(){
        if ($(this).hasClass('act')) {
            $(this).removeClass('act');
            body.css('overflow', 'auto');
            sidebarOverlay.add(mobileMenu).removeClass('act');
        } else {
            $(this).addClass('act');
            body.css('overflow', 'hidden');
            sidebarOverlay.add(mobileMenu).addClass('act');
        }
        mobilesearch.add(mobileBtnSearch).removeClass('act');
    });
    mobileBtnSearch.click(function(){
        if ($(this).hasClass('act')) {
            $(this).removeClass('act');
            mobilesearch.removeClass('act');
            $('.search_overlay').removeClass('act')
        } else {
            $(this).addClass('act');
            mobilesearch.addClass('act');
            $('.search_overlay').addClass('act')
        }
        body.css('overflow', 'auto');
        sidebarOverlay.add(showMegamenu).add(mobileMenu).removeClass('act');
    })
    $('.search_overlay').click(function() {
        mobilesearch.removeClass('act');
        mobileBtnSearch.removeClass('act');
    })
};
novtheme.Copy = function () {
    $('.copy-btn').click(function() {
        const el = $(this);
        const copy = el.data('copy');
        const copied = el.data('copied');
        const input = el.siblings('input')[0];
        input.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        el.find('span').text(copied);
        setTimeout(() => el.find('span').text(copy), 2500);
    });
};
novtheme.ProductDetail = function() {
    jQuery('product-variant-swatch :radio, product-variant-dropdown select').change(function() {
      var optionValue = jQuery(this).val();
      jQuery(this).parents('fieldset, .product-form__input').find('.variant_current').text(optionValue);
      // Style image grid and scroll
      if ($(window).width() > 991 ) {
        if ($('.product-template__imggrid').length > 0 || $('.product-template__scroll').length > 0) {
          setTimeout(function() {
            var parent = $('.product-template__imggrid .proFeaturedImage, .product-template__scroll .proFeaturedImage'),
                active = parent.find('.act'),
                positi = active.data('position'),
                offset = active.offset().top;
                $("body,html").animate({scrollTop: offset}, "normal");
                $('.thumbItem').removeClass('active');
                $('.thumbItem[data-position="'+ positi +'"]').addClass('active');
          }, 200);
        }
      }
    });
    if ($('.product-single__stick-add').length > 0) {
      var winHeight = $(window).height();
      $(window).scroll(function() {
        if ($(window).scrollTop() > winHeight) {
          $('.product-single__stick-add').addClass('act');
        } else {
          $('.product-single__stick-add').removeClass('act');
        }
      });
      $(window).on('load', function() {
        if($('.product-single__stick-add').length > 0 && currentWidth>=768) {
          var h = $('.product-single__stick-add').height();
          body.css('padding-bottom', h)
        }
      })
    }
};
novtheme.VerticalThumbnailProductDetail= function() {
    var proTemplateScroll = $('.product-template__scroll');
    var proFeaturedImage = proTemplateScroll.find('.proFeaturedImage');
    if (currentWidth > 991 && $('.template-product').length > 0 ) {
        $(window).on('mousewheel DOMMouseScroll wheel', (function(e) {
            proFeaturedImage.find('.item.act').each(function(){
                var item = $(this),
                    p = item.data('position'),
                    hd = item.height()/2,
                    srt = $(window).scrollTop(),
                    y = e.originalEvent.deltaY,
                    offset_top = item.offset().top;
                if (y > 0) {
                    if (p < proFeaturedImage.find('.item').length) {
                        var npd = p + 1;
                    } else {
                        var npd = p;
                    }
                    if (srt > offset_top + hd) {
                       item.removeClass('act');
                       proFeaturedImage.find('.item[data-position="'+ npd +'"]').addClass('act');
                       $('.thumbItem').removeClass('active');
                       $('.thumbItem[data-position="'+ npd +'"]').addClass('active');
                    }
                } else {
                    if (p > 1) {
                        var npu = p - 1;
                    } else {
                        var npu = p;
                    }
                    if (srt < offset_top - hd) {
                        item.removeClass('act');
                        proFeaturedImage.find('.item[data-position="'+ npu +'"]').addClass('act');
                        $('.thumbItem').removeClass('active');
                        $('.thumbItem[data-position="'+ npu +'"]').addClass('active');
                    }
                }
                proTemplateScroll.find('.thumb_vertical_slick').slick('slickGoTo', p);
            });
        }));
        proTemplateScroll.find('.thumbItem').click(function(){
            var p = $(this).data('position');
            proTemplateScroll.find('.thumbItem').removeClass('active');
            $(this).addClass('active');
            proFeaturedImage.find('.item').removeClass('act');
            proFeaturedImage.find('.item[data-position="'+ p +'"]').addClass('act');
            var ost = proFeaturedImage.find('.item.act').offset().top;
            $("body,html").animate({scrollTop: ost - 60}, "normal");
        });
    }
    if (currentWidth < 992 ) {
        var initialIndexScroll = $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').children('.item.act').index();
        if (initialIndexScroll < 0) initialIndexScroll = 0;
        $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').on('init', function(event, slick){
            if (initialIndexScroll > 0) {
                slick.slickGoTo(initialIndexScroll, true);
            }
        }).slick({
            slide: '.item',
            initialSlide: initialIndexScroll,
            swipeToSlide: true,
            infinite: false,
            arrows: false,
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1
        }).on('afterChange',function(e,o){
            $('iframe').each(function(){
                $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            });
            proFeaturedImage.find('.slick-slide:not(.slick-active) video').trigger('pause');
        });
        proFeaturedImage.on('afterChange', function(event, slick, currentSlide) {
            var thumbSlick = $('#productThumbs .thumb_slick').slick('getSlick');
            var thumbQty = $('#productThumbs .thumb_slick').find('.item').length;
            var thumbSlidesToShow = (thumbSlick && thumbSlick.options && typeof thumbSlick.options.slidesToShow === 'number') ? thumbSlick.options.slidesToShow : 1;
            if (thumbQty > thumbSlidesToShow) {
                $('#productThumbs .thumb_slick').slick('slickGoTo', currentSlide);
            }
            $('#productThumbs .thumb_slick').find('.slick-slide').removeClass('active');
            $('#productThumbs .thumb_slick').find('.slick-slide[data-slick-index="' + currentSlide + '"]').addClass('active');
        });

        $('.product-template__scroll .thumb_slick').on('click', '.thumbItem', function(event) {
            event.preventDefault();
            $('.thumb_slick').find('.slick-slide').removeClass('active');
            $(this).addClass('active');
            var goToSingleSlide = $(this).data('slick-index');
            $('.product-template__scroll .proFeaturedImage').slick('slickGoTo', goToSingleSlide);
        });
        $('product-variant-swatch label').click(function () {
            setTimeout(function() {
                var dindex = $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').find('.item.act').attr('data-slick-index');
                $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').slick('slickGoTo', dindex);
            }, 300);
        })
    }
};
novtheme.ThumbnailProductDetail = function() {
    var $FeaturedImage = $('.FeaturedImage_slick');
    var $ThumbImage = $('#productThumbs .thumb_slick');
    var dots = $FeaturedImage.data("dots"),
        nav = $FeaturedImage.data("nav"),
        draggable = $FeaturedImage.data("draggable"),
        items = $FeaturedImage.data("items"),
        items_lg = $FeaturedImage.data("items_lg"),
        items_md = $FeaturedImage.data("items_md"),
        items_sm = $FeaturedImage.data("items_sm"),
        items_xs = $FeaturedImage.data("items_xs"),
        qtyItem = $ThumbImage.find('.item').length,
        appenddots = $FeaturedImage.closest('.nov-product__single-thumb').find('.append-dots');
        if (qtyItem < 20) {
            var dotXs = true;
        }else {
            var dotXs = false;
        }
    var initialIndex = $FeaturedImage.children('.item.act').index();
    if (initialIndex < 0) initialIndex = 0;

    $FeaturedImage.on('init', function(event, slick) {
        if (initialIndex > 0) {
            slick.slickGoTo(initialIndex, true);
        }
    }).slick({
        slide: '.item',
        initialSlide: initialIndex,
        swipeToSlide: true,
        nextArrow: '<div class="arrow-next">' + theme.icon_next +'</div>',
        prevArrow: '<div class="arrow-prev">' + theme.icon_prev +'</div>',
        slidesToShow: items,
        slidesToScroll: 1,
        dots: dots,
        arrows: nav,
        adaptiveHeight: true,
        infinite: true,
        speed: 500,
        cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)',
        rtl: rtl,
        draggable: draggable,
        appendDots: appenddots.length ? appenddots : $FeaturedImage,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: items_lg,
                    slidesToScroll: 1,
                    vertical: vertical_lg,
                    verticalSwiping: vertical_lg,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: items_md,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: items_sm,
                    slidesToScroll: 1,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: items_xs,
                    slidesToScroll: 1,
                    dots: dotXs
                }
            }
        ]
    });
    $FeaturedImage.closest('.nov-product__single-thumb').find('.nav-prev').click(function(){
        $FeaturedImage.slick('slickPrev');
    });
    $FeaturedImage.closest('.nov-product__single-thumb').find('.nav-next').click(function(){
        $FeaturedImage.slick('slickNext');
    })

    var infinite = $ThumbImage.data("loop"),
        dots = $ThumbImage.data("dots"),
        nav = $ThumbImage.data("nav"),
        vertical = $ThumbImage.data("vertical"),
        vertical_lg = $ThumbImage.data("vertical_lg"),
        vertical_md = $ThumbImage.data("vertical_md"),
        vertical_sm = $ThumbImage.data("vertical_sm"),
        items = $ThumbImage.data("items"),
        items_lg = $ThumbImage.data("items_lg"),
        items_md = $ThumbImage.data("items_md"),
        items_sm = $ThumbImage.data("items_sm"),
        items_xs = $ThumbImage.data("items_xs");
        if (vertical == true) {
            rtl = false;
        }
    $ThumbImage.on('init', function(event, slick) {
        $(this).find('.slick-slide').removeClass('active');
        $(this).find('.slick-slide[data-slick-index="' + initialIndex + '"]').addClass('active');
        var currentSlidesToShow = (slick && slick.options && typeof slick.options.slidesToShow === 'number') ? slick.options.slidesToShow : items;
        if (qtyItem > currentSlidesToShow && initialIndex > 0) {
            slick.slickGoTo(initialIndex, true);
        }
    })
    .slick({
        initialSlide: (qtyItem > items ? initialIndex : 0),
        swipeToSlide: true,
        nextArrow: '<div class="arrow-next">' + theme.icon_next +'</div>',
        prevArrow: '<div class="arrow-prev">' + theme.icon_prev +'</div>',
        infinite: infinite,
        slidesToShow: items,
        slidesToScroll: 1,
        dots: dots,
        arrows: nav,
        rtl: rtl,
        vertical: vertical,
        verticalSwiping: vertical,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: items_lg,
                    slidesToScroll: 1,
                    vertical: vertical_lg,
                    verticalSwiping: vertical_lg,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: items_md,
                    slidesToScroll: 1,
                    vertical: vertical_md,
                    verticalSwiping: vertical_md,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: items_sm,
                    slidesToScroll: 1,
                    vertical: vertical_sm,
                    verticalSwiping: vertical_sm,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: items_xs,
                    slidesToScroll: 1,
                    vertical: false,
                    verticalSwiping: false
                }
            }
        ]
    });

    $FeaturedImage.on('afterChange', function(event, slick, currentSlide) {
        var thumbSlick = $ThumbImage.slick('getSlick');
        var thumbSlidesToShow = (thumbSlick && thumbSlick.options && typeof thumbSlick.options.slidesToShow === 'number') ? thumbSlick.options.slidesToShow : items;
        if (qtyItem > thumbSlidesToShow) {
            $ThumbImage.slick('slickGoTo', currentSlide);
        }
        $ThumbImage.find('.slick-slide.active').removeClass('active');
        $ThumbImage.find('.slick-slide[data-slick-index="' + currentSlide + '"]').addClass('active');
        $FeaturedImage.find('.slick-slide:not(.slick-active) iframe').each(function(){
            $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
        $FeaturedImage.find('.slick-slide:not(.slick-active) video').trigger('pause');
        // Type thumb grid
        $('.thumbgrid .thumbItem').removeClass('active');
        $('.thumbgrid .thumbItem[data-position="' + currentSlide + '"]').addClass('active');
    });
    $ThumbImage.on('click', '.slick-slide', function(event) {
        event.preventDefault();
        $ThumbImage.find('.slick-slide.active').removeClass('active');
        $(this).addClass('active');
        var position = $(this).data('slick-index');
        $FeaturedImage.slick('slickGoTo', position);
    });
    // Type thumb grid
    $('.thumbgrid .thumbItem').on('click', function(event) {
        event.preventDefault();
        var position = $(this).data('position');
        $FeaturedImage.slick('slickGoTo', position);
    });
    $('product-variant-swatch :radio, product-variant-dropdown select').change(function() {
        setTimeout(function() {
            var dindex = $FeaturedImage.find('.item.act').attr('data-slick-index');
            $FeaturedImage.slick('slickGoTo', dindex);
        }, 300);
    })
    if (responsive_mobile) {
        $('.thumbgrid .thumblist').slick({
            infinite: false,
            arrows: false,
            dots: false,
            slidesToShow: 4,
            slidesToScroll: 4
        })
    }
};
novtheme.Countdown = function() {
    function startCountdown($countdown, showDays, restartCountdown) {
        var finalDate = $countdown.data('countdown');
        var showDays = showDays || false;
        var restartCountdown = restartCountdown || false;
        var finalDateGetTime = new Date(finalDate).getTime();
        var NewfinalDate = "";
        var now = new Date();
    
        if (finalDateGetTime - now.getTime() < 0 && restartCountdown == true) {
            NewfinalDate = new Date(now.getTime() + (86400 - (now.getHours() * 60 * 60) - (now.getMinutes() * 60) - now.getSeconds()) * 1000);
        } else {
            NewfinalDate = finalDate;
        }
        function formatDigits(number) {
            return number.toString().split('').map(function(digit) {
                return '<span>' + digit + '</span>';
            }).join('');
        }
        $countdown.countdown(NewfinalDate, function(event) {
            var dayString = showDays ? 
                '<div class="item-time"><span class="data-number">' + formatDigits(event.strftime('%D')) + '</span><span class="name-time">' + theme.strings.days + '</span></div>' : '';
            
            var countdown_html = dayString
                + '<div class="item-time"><span class="data-number">' + formatDigits(event.strftime('%H')) + '</span><span class="name-time">' + theme.strings.hours + '</span></div>'
                + '<div class="item-time"><span class="data-number">' + formatDigits(event.strftime('%M')) + '</span><span class="name-time">' + theme.strings.minutes + '</span></div>'
                + '<div class="item-time"><span class="data-number">' + formatDigits(event.strftime('%S')) + '</span><span class="name-time">' + theme.strings.seconds + '</span></div>';
    
            $countdown.html(countdown_html);
    
        }).on('finish.countdown', function() {
            if (restartCountdown) {
                startCountdown($countdown, showDays, restartCountdown);
            }
        });
    }
    
    $('[data-countdown]').each(function() {
        var showDays = $(this).data('show-days') || false;
        var restartCountdown = $(this).data('restart') || false;
        startCountdown($(this), showDays, restartCountdown);
    });
};
novtheme.eventBlockCart = function(e) {
    $('.header-cart').click(function(){
        sidebarOverlay.addClass('act');
        $("#desktop_cart").addClass('active');
        body.addClass('minicart_open');
        $('.nov_item_act, .nov_btn_act').removeClass('act');
        if (responsive_mobile) {
            body.addClass('open-canvans-cart');
            $('#show-megamenu, #mobile_menu').removeClass('act');
        }
    });
    $('.close_cart').click(function(){
        sidebarOverlay.removeClass('act');
        $('#desktop_cart').removeClass('active');
        body.removeClass('minicart_open');
        $('.cart_extend').removeClass('act');
        $('.extend--label__item').removeClass('act').each(function() {
            var title = $(this).data('title');
            $(this).attr('data-original-title', title);
        });
        $('.cart_extend--label').removeClass('act');
        $('.nov_item_act, .nov_btn_act').removeClass('act');
        if (responsive_mobile) {
            body.removeClass('open-canvans-cart');
        }
    });
};
novtheme.NovTogglePage = function() {
    $('.nov-toggle-page[data-target="#mobile-pageaccount"]').on('click', function(e) {
        var target = $(this).data('target');
        $(target).hasClass('active') ? ($(target).removeClass('active'), sidebarOverlay.removeClass('act').css('z-index', '99')) : ($(target).addClass('active'), sidebarOverlay.addClass('act').css('z-index', '999'));
        e.preventDefault();
    });
    $('.mobile-boxpage .close-box').on('click', function(e) {
        $(this).parents('.mobile-boxpage').removeClass('active');
        sidebarOverlay.removeClass('act')
        e.preventDefault();
    });
};
novtheme.SearchAutoComplete = function () {
    searchCanvas.find('.search_autocomplete').removeClass('hidden');
    $('.search-header__input').on('focus click', function (e) {
        e.stopPropagation();
        blockAutoComplete.slideDown();
    });
    $(document).on('click', function (e) {
        if (currentWidth > 767 && searchCanvas.length == 0) {
            if (!$(e.target).closest('.search-header__input, .search_autocomplete').length) {
                blockAutoComplete.slideUp();
            }
        }
    });

    $(document).on('click', '.search-category__select', function (e) {
        e.stopPropagation();
        var $select = $(this);
        var $dropdown = $select.find('.search-category__dropdown');
        var isOpen = $select.hasClass('open');
        // Đóng tất cả dropdown đang mở
        $('.search-category__select.open').not($select).each(function () {
            $(this).removeClass('open');
            $(this).find('.search-category__dropdown').slideUp(200);
        });
        if (isOpen) {
            $select.removeClass('open');
            $dropdown.slideUp(200);
        } else {
            $select.addClass('open');
            $dropdown.slideDown(250);
        }
    });
    $(document).on('click', '.search-category__option', function (e) {
        e.stopPropagation();
        var $option = $(this);
        var value = $option.attr('data-value');
        var text = $option.text().trim();
        var $select = $option.closest('.search-category__select');
        $select.find('.search-category__selected').attr('data-value', value).text(text);
        $select.find('.search-category__option').removeAttr('aria-selected');
        $option.attr('aria-selected', 'true');
        $select.removeClass('open');
        $select.find('.search-category__dropdown').slideUp(200);
        var form = $select.closest('form');
        var input = form.find('input[name="q"]');
        input.removeAttr('data-old-term');
        if (input.val().length > 0) {
            runAutocomplete(input);
        }
    });
    $(document).on('click.categoryDropdown', function (e) {
        if (!$(e.target).closest('.search-category__select').length) {
            $('.search-category__select.open').each(function () {
                $(this).removeClass('open');
                $(this).find('.search-category__dropdown').slideUp(200);
            });
        }
    });
    $(document).on('keydown', '.search-category__select', function (e) {
        var $select = $(this);
        var isOpen = $select.hasClass('open');
        var $dropdown = $select.find('.search-category__dropdown');
        var $options = $select.find('.search-category__option');
        var $current = $options.filter('[aria-selected="true"]');
        var currentIndex = $options.index($current);
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isOpen) {
                $select.removeClass('open');
                $dropdown.slideUp(200);
            } else {
                $select.addClass('open');
                $dropdown.slideDown(250);
            }
        } else if (e.key === 'Escape') {
            $select.removeClass('open');
            $dropdown.slideUp(200);
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            var nextIndex = Math.min(currentIndex + 1, $options.length - 1);
            $options.eq(nextIndex).trigger('click');
        } else if (e.key === 'ArrowUp' && isOpen) {
            e.preventDefault();
            var prevIndex = Math.max(currentIndex - 1, 0);
            $options.eq(prevIndex).trigger('click');
        }
    });
    $(document).on('submit', 'form[action="search"]', function (e) {
        var categoryHandle = $(this).find('.search-category__selected').attr('data-value') || '';
        var query = $(this).find('input[name="q"]').val().trim();
        if (categoryHandle && categoryHandle !== '') {
            if (query === '') {
                e.preventDefault();
                window.location.href = '/collections/' + categoryHandle;
            }
            e.preventDefault();
            window.location.href = '/collections/' + categoryHandle + '?q=' + encodeURIComponent(query);
        }
    });

    var currentAjaxRequest = null;
    $('form[action="search"]').each(function () {
        var input = $(this).find('input[name="q"]');
        if ($(this).find('.search-results__block').length == 0) {
            $('<div class="search-results__block"></div>').appendTo($(this).find('.search_autocomplete-content'));
        }
        $(this).find('.search-results__block').append('<ul class="search-results list-unstyled d-flex"></ul>');

        input.attr('autocomplete', 'off').bind('keyup change', function () {
            runAutocomplete($(this));
        });
        $('.search-trend-item').click(function () {
            var trend_value = $(this).text().trim();
            var $input = $('form[action="search"] input[name="q"]');
            $('.search-header__placeholder').hide();
            $input.val(trend_value);
            $input.trigger('keyup');
        });
    });

    function getSelectedCategory(form) {
        var $selected = form.find('.search-category__selected');
        return $selected.length ? $selected.attr('data-value') || '' : '';
    }

    function runAutocomplete(input) {
        var term = input.val();
        if (term.length > 0) {
            $('.btn-search__clear-text').removeClass('hide');
            $('.search-header__content .icon').hide();
            if (searchCanvas.length == 0 && currentWidth > 767) {
                blockAutoComplete.slideDown();
            }
            $('.search_overlay').addClass('act');
            $('.search-header__placeholder').hide();
        } else {
            $('.btn-search__clear-text').addClass('hide');
            $('.search-header__content .icon').show();
            $('.search-header__placeholder').show();
        }
        $(document).off('click', '.btn-search__clear-text').on('click', '.btn-search__clear-text', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $form = $(this).closest('form');
            var $input = $form.find('input[name="q"]');
            $input.val('').removeAttr('data-old-term');
            $form.find('.search-header__content .icon').show();
            $form.find('.search-header__placeholder').show();
            $form.find('.search-results__block').show().removeAttr('style').find('.search-see_all, .search-message').remove();
            $form.find('.search-results').empty();
            $(this).addClass('hide');
            blockAutoComplete.slideDown();
            if (currentAjaxRequest != null) currentAjaxRequest.abort();
        });

        var form = input.closest('form');
        var categoryHandle = getSelectedCategory(form);

        var baseSearchURL;
        if (categoryHandle && categoryHandle !== '') {
            baseSearchURL = '/collections/' + categoryHandle + '?q=' + encodeURIComponent(term);
        } else {
            baseSearchURL = '/search?type=product&q=' + encodeURIComponent(term);
        }
        var autocompleteURL = '/search?type=product&q=' + encodeURIComponent(term);

        var resultsListBlock = form.find('.search-results__block');
        var resultsList = form.find('.search-results');

        if (term.length <= 2) {
            input.removeAttr('data-old-term');
            resultsListBlock.show().removeAttr('style');
            resultsList.empty();
            resultsListBlock.find('.search-see_all, .search-message').remove();
            blockAutoComplete.slideDown();
            if (currentAjaxRequest != null) currentAjaxRequest.abort();
        } else if (term != input.attr('data-old-term')) {
            input.attr('data-old-term', term);
            if (currentAjaxRequest != null) currentAjaxRequest.abort();
            currentAjaxRequest = $.getJSON(autocompleteURL + '&view=json', function (data) {
                resultsList.empty();
                resultsListBlock.find('.search-see_all, .search-message').remove();

                var filteredResults = data.results || [];
                if (categoryHandle && categoryHandle !== '') {
                    filteredResults = filteredResults.filter(function (item) {
                        return item.url && item.url.indexOf('/collections/' + categoryHandle) !== -1;
                    });
                }

                var totalCount = filteredResults.length;
                if (data.results_count == 0 || totalCount == 0) {
                    var msgText = theme.strings.no_results_live_region_html
                        ? theme.strings.no_results_live_region_html.replace('[terms]', term)
                        : 'No results found for "<strong>' + term + '</strong>". Check the spelling or use a different word or phrase.';
                    var noResultsHTML = '<div class="search-message w-100 text-center mb-30" data-message=""><span data-results-search-live-region-count-value="">' + msgText + '</span></div>';
                    resultsListBlock.prepend(noResultsHTML);
                    resultsListBlock.show().removeAttr('style');
                } else {
                    $.each(filteredResults, function (index, item) {
                        var link = $('<a class="w-100"></a>').attr('href', item.url);
                        link.append('<div class="thumbnail"><img src="' + item.thumbnail + '" class="w-100" /></div>');
                        link.append('<div class="product-info"><div class="title">' + item.title + '</div><div class="price price-st">' + item.price + '</div></div>');
                        link.wrap('<li></li>');
                        resultsList.append(link.parent());
                    });
                    if (totalCount > 0) {
                        resultsList.after('<div class="search-see_all"><a class="see_all btn btn-secondary fs-12" href="' + baseSearchURL + '"><span>' + theme.strings.results_all + '</span> (' + totalCount + ')</a></div>');
                    }
                    resultsListBlock.fadeIn(200);
                }
            });
        }
    }

    // ── Voice Search ──────────────────────────────────────────────
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        $('.btn-search__mic').hide();
    } else {
        $(document).on('click', '.btn-search__mic', function () {
            var $btn = $(this);
            var $form = $btn.closest('form');
            var $input = $form.find('.search-header__input');

            if ($btn.data('listening')) {
                $btn.data('recognition').stop();
                return;
            }

            var recognition = new SpeechRecognition();
            recognition.lang = document.documentElement.lang === 'vi' ? 'vi-VN' : 'en-US';
            recognition.interimResults = true;
            recognition.continuous = false;
            recognition.maxAlternatives = 1;

            $btn.data('recognition', recognition);

            recognition.onstart = function () {
                $btn.data('listening', true).addClass('is-listening voice').attr('aria-pressed', 'true');
                $form.find('.search-header__placeholder').hide();
            };

            recognition.onresult = function (event) {
                var transcript = '';
                for (var i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                $input.val(transcript);
                $form.find('.search-header__placeholder').hide();
                $form.find('.btn-search__clear-text').removeClass('hide');
                $input.trigger('keyup');
            };

            recognition.onend = function () {
                $btn.data('listening', false).removeClass('is-listening voice').attr('aria-pressed', 'false');
                if ($input.val().trim().length === 0) {
                    $form.find('.search-header__placeholder').show();
                } else {
                    $form.find('.search-header__placeholder').hide();
                }
                $input.focus();
            };

            recognition.onerror = function (event) {
                $btn.data('listening', false).removeClass('is-listening voice').attr('aria-pressed', 'false');
                if ($input.val().trim().length === 0) {
                    $form.find('.search-header__placeholder').show();
                } else {
                    $form.find('.search-header__placeholder').hide();
                }
            };

            try {
                recognition.start();
            } catch (e) {
                // Handle error silently or log if needed
            }
        });
    }
    // ── /Voice Search ─────────────────────────────────────────────

};
novtheme.goToTop = function() {
    var $progress = $('#_desktop_back_top').find('.progress');
    var radius = 21;
    var circumference = 2 * Math.PI * radius;

    $progress.css({
    'stroke-dasharray': circumference,
    'stroke-dashoffset': circumference
    });

    function updateScrollButton() {
        var scrollTop = $(window).scrollTop();
        var docHeight = $(document).height() - $(window).height();
        var scrollPercent = scrollTop / docHeight;
        var offset = circumference * (1 - scrollPercent);

        $progress.css('stroke-dashoffset', offset);

        if (scrollTop >= 500) {
            $('#_desktop_back_top').fadeIn(500);
        } else {
            $('#_desktop_back_top').fadeOut(200);
        }
    }
    $(window).on('scroll', updateScrollButton);

    $(window).on('load', function () {
        updateScrollButton();
    });

    $('#_desktop_back_top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
    });
};
novtheme.PopupNewletter = function() {
    var popupSubscribe = $("#popup-subscribe");
    var date = new Date();
    var minutes = 60;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    if ($.cookie('popupNewLetterStatus') != 'closed' && body.outerWidth() > 768) {
        popupSubscribe.modal({
            show: !0
        });
    }
    if ($.cookie('popupNewLetterStatus') != 'closed' && popupSubscribe.data('sm') == true && responsive_mobile) {
        popupSubscribe.modal({
            show: !0
        });
    }
    $('input.no-view').change(function() {
        if ($('input.no-view').prop("checked") == 1) {
            $.cookie("popupNewLetterStatus", "closed", {
                'expires': date,
                'path': '/'
            })
        } else {
            $.cookie("popupNewLetterStatus", "", {
                'expires': date,
                'path': '/'
            })
        }
    })
    if (popupSubscribe.hasClass('promotion')) {
        popupSubscribe.click(function(){
            $.cookie("popupNewLetterStatus", "closed", {
                'expires': date,
                'path': '/'
            })
        })
    }
};
novtheme.MenuSidebar = function() {
    $('.categories__sidebar .hasSubCategory a').each(function(index) {
        if ($(this).hasClass('active')) {
            $(this).parent().children('.collapse').collapse('show');
        }
    })
};
novtheme.Nov_iframe_video = function() {
    var $videoSrc,
        modalVideo = $('#ModalVideo');
    $('.icon_play').click(function() {
        $videoSrc = $(this).data( "src" );
    });
    modalVideo.on('shown.bs.modal', function (e) {
        modalVideo.find('.embed-responsive').html('<iframe class="embed-responsive-item" src="'+ $videoSrc +'" id="video" allowfullscreen></iframe>');
    });
    modalVideo.on('hide.bs.modal', function (e) {
        modalVideo.find('iframe').remove();
    });
    $('.btn-video__play').click(function(){
        var id = $(this).data('id');
        $(this).closest('.nov-slick-carousel').find('.video-block .bg-video__cover, .video-block .block-text, .video-block .btn-video__play').fadeIn();
        $(this).closest('.nov-slick-carousel').find('video').trigger('pause');
        $(this).fadeOut();
        $('.bg-video__cover[data-id="'+ id +'"], .block-text[data-id="'+ id +'"]').fadeOut();
        $('video[data-id="'+ id +'"]').trigger('play');
    })
    $('video').each(function(){
        var alt = $(this).data('alt');
        if (alt && alt.length) {
            $(this).find('img').attr('alt', alt);
        }
    });

    var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));
  
    if ("IntersectionObserver" in window) {
      var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(video) {
          if (video.isIntersecting) {
            for (var source in video.target.children) {
              var videoSource = video.target.children[source];
              if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = videoSource.dataset.src;
              }
            }
  
            video.target.load();
            video.target.classList.remove("lazy");
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });
  
      lazyVideos.forEach(function(lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
};
novtheme.LoadmoreByButton = function(){
    var moreButon =  $('.btn_loadmore');
    var data = $(moreButon).parents('.grid--view-items');
    $(moreButon).each(function(){
        var btnHandle = $(this).attr('btn-handle');
        var nextUrl = $(this).attr("link");
        body.on('click', '.'+btnHandle+'', function(){
            $.ajax({
                url: nextUrl,
                type: 'GET',
                dataType: 'html',
                beforeSend: function() {
                    $('.'+btnHandle).addClass('loading');
                }
            }).done(function(data) {
                $('.product__loadmore-'+btnHandle).append($(data).find('.product__loadmore-'+btnHandle).html());
                var m = $('.pagination__bar'+btnHandle+'').data('max');
                var dataitem = $('.product__loadmore-'+btnHandle);
                AnimateLoadmore(dataitem);
                if (show_rating == true) {
                    if (typeof window.avadaAirReviewRerender === 'function' && $('.AirReviews-Widget').length > 0) {
                        window.avadaAirReviewRerender();
                    }
                }
                nextUrl = $(data).find('.btn_loadmore').attr("link");
                var n = $('.product__loadmore-'+btnHandle).find('.item').length;
                $('.pagination__count'+btnHandle+' .count').text(n);
                $('.pagination__bar'+btnHandle+' .progress').css('width',  n/m*100 + '%');
                if (n < m) {
                    $('.'+btnHandle).removeClass('loading');
                } else {
                    $('.'+btnHandle).remove();
                }
            });
        });
    });
    function AnimateLoadmore (el) {
        var xxl = el.data('xxl'),
            xl = el.data('xl'),
            lg = el.data('lg'),
            md = el.data('md'),
            sm = el.data('sm'),
            xs = el.data('xs');
        el.find('.item').each(function () {
            var index = $(this).index() + 1;
            var n;
            if ($(document).width() > 1439) {
                n = xxl;
            } else if ($(document).width() > 1199) {
                n = xl;
            } else if ($(document).width() > 991) {
                n = lg;
            } else if ($(document).width() > 767) {
                n = lg;
            } else if ($(document).width() > 575) {
                n = sm;
            } else {
                n = xs;
            }
            var modulo = Math.round(index % n * 0.3);
            $(this).attr('data-wow-duration', modulo+'s');
            if (index % n == 0) {
                var modulo0 = index % n + n *0.3;
                $(this).attr('data-wow-duration', modulo0+'s');
            } 
        });
    }
};
novtheme.Mainmenu = function() {
    $('.site-nav--btn').off('click').on('click', function() {
        if ($(window).width() > 1199) {
            $(this).toggleClass('act');
        } else {
            var mobileMenu = $('#mobile_menu');
            if ($(this).hasClass('act')) {
                $(this).removeClass('act');
                sidebarOverlay.add(mobileMenu).removeClass('act');
            } else {
                $(this).addClass('act');
                sidebarOverlay.add(mobileMenu).addClass('act');
            }
            $('.mobile-btn_search, #mobile_search, .search_overlay ').removeClass('act');
        }
    });
    function initNavBlogSlick() {
        $('[data-section-type="nav-blog-slick"]').each(function () {
            var el = $(this);
            var slider = el.find('.nav-blog-slick-carousel');
            if (!slider.length || slider.hasClass('slick-initialized')) return;
            var rtl = $('html').hasClass('lang-rtl');
            slider.slick({
                nextArrow: '<div class="arrow-next">' + (theme.icon_next || '<i class="zmdi zmdi-chevron-right"></i>') + '</div>',
                prevArrow: '<div class="arrow-prev">' + (theme.icon_prev || '<i class="zmdi zmdi-chevron-left"></i>') + '</div>',
                slidesToShow: slider.data('items_xxl') || 1,
                slidesToScroll: 1,
                rows: slider.data('row') || 1,
                arrows: slider.data('nav') !== undefined ? slider.data('nav') : false,
                dots: slider.data('dots') !== undefined ? slider.data('dots') : false,
                infinite: slider.data('loop') !== undefined ? slider.data('loop') : true,
                autoplay: slider.data('autoplay') || false,
                autoplaySpeed: slider.data('autoplaytimeout') || 5000,
                rtl: rtl
            });
        });
    }
    initNavBlogSlick();
    $(document).on('mouseenter', '[data-section-type="nav-blog-slick"]', function () {
        var slider = $(this).find('.nav-blog-slick-carousel');
        if (slider.length && !slider.hasClass('slick-initialized')) {
            initNavBlogSlick();
        }
    });
};
novtheme.CollectionPage = function() {
    var gridlistToggle = $('.gridlist-toggle'),
        collectionContent = $('.collection__product-content'),
        item = gridlistToggle.find('a');
    if (localStorage.getItem('view_collection')) {
        item.removeClass('active');
        if (gridlistToggle.find('[data-type="'+ localStorage.getItem('view_collection') +'"]').length > 0) {
            gridlistToggle.find('[data-type="'+ localStorage.getItem('view_collection') +'"]').addClass('active');
            collectionContent.attr('data-grid', localStorage.getItem('view_collection'));
        } else {
            gridlistToggle.find('a:first-child').addClass('active');
            collectionContent.attr('data-grid', gridlistToggle.find('a:first-child').data('type'));
        }
    }
    item.click(function(e) {
        e.preventDefault();
        var typeview = $(this).data('type');
        if (!$(this).hasClass('active')) {
            collectionContent.attr('data-grid', typeview);
            item.removeClass('active');
            $(this).addClass('active');
        }
        localStorage.setItem('view_collection', collectionContent.attr('data-grid'));
    });
    if($(window).width() <992 ) {
        collectionContent.attr('data-grid', 'grid-3');
        item.removeClass('active');
        gridlistToggle.find('#grid-3').addClass('active');
        $('.collection-topsidebar .facets__label').addClass('act')
    }
    if($(window).width() <768 ) {
        collectionContent.attr('data-grid', 'grid-2');
        item.removeClass('active');
        gridlistToggle.find('#grid-2').addClass('active');
    };
    // Click filter sort by
    var sortBy = $('[name="sort_by"]'),
        text = sortBy.find('[selected="selected"]').text(),
        val = sortBy.find('[selected="selected"]').attr('value'),
        sortbyFilter = $('[data-sortby-filter]'),
        sortbyItem = sortbyFilter.find('[data-sortby-item]');
        sortbyFilter.find('.sort-by__label').text(text);

    sortbyFilter.find('[data-value="'+ val +'"]').addClass('act');

    sortbyItem.off('click').on('click', function (event) {
        var valuesort = $(this).data('value');
        var newtext = $(this).text();
        sortbyItem.removeClass('act');
        $(this).addClass('act');
        sortbyFilter.find('.sort-by__label').text(newtext);
        sortBy.val(valuesort);
        sortbyFilter.find('.nov-accordion__title').removeClass('act');
        sortbyFilter.removeClass('act');
        sortbyFilter.find('.nov-accordion__content').slideUp();
        const form = document.querySelector('collection-filter-product');
        if (form) {
            form.onSubmitHandlerSortBy(event, form.querySelector('form'));
        }
    });
    if (!isClickEventAttached) {
        $('.collection__category-seemore').click(function(){
            $('.collection__category-item.hidde').slideToggle(300);
        });
        isClickEventAttached = true;
    }
};
novtheme.CollectionPageLoadmore = function() {
    var product_grid = $('.collection__grid-loadmore'),
        next_url = product_grid.data('next-url'),
        btnLoadmore = $('.collection__btn-loadmore');
    if (next_url) {
        btnLoadmore.click(function(){
            CollectionLoadmore();
        });
    }
    function CollectionLoadmore() {
        $.ajax (
            {
                url: next_url,
                type: 'GET',
                dataType: 'html',
                beforeSend: function(){
                    btnLoadmore.addClass('loading');
                }
            }
        ).done(function (next_page) {
            var new_page = $(next_page).find('.collection__grid-loadmore'),
                new_url = new_page.data('next-url'),
                m = $('.pagination__bar').data('max');
            next_url = new_url;
            if (typeof next_url !== "undefined") {
                btnLoadmore.removeClass('loading');
            } else {
                btnLoadmore.remove();
            }
            product_grid.append(new_page.html());
            var n = product_grid.find('.product--item').length;
            $('.pagination__count .count').text(n);
            $('.pagination__bar .progress').css('width',  n/m*100 + '%');
            if (show_rating == true) {
                if (typeof window.avadaAirReviewRerender === 'function' && $('.AirReviews-Widget').length > 0) {
                    window.avadaAirReviewRerender();
                }
            }
            novtheme.Countdown();
        })
    }
};
novtheme.NovAccordion = function() {
    $('.nov-accordion').each(function () {
        var $accordion = $(this);

        if ($accordion.hasClass('first-open')) {
            $accordion.find('.nov-accordion__item:first-child .nov-accordion__title').addClass('act');
            $accordion.find('.nov-accordion__item:first-child .nov-accordion__content').slideDown();
        }

        $accordion.find('.nov-accordion__title').each(function () {
            var $title = $(this);
            var $content = $title.siblings('.nov-accordion__content');

            if (typeof responsive_mobile !== 'undefined' && responsive_mobile) {
                $title.removeClass('act');
                $title.parent().removeClass('act');
                $content.hide();
            }

            if ($title.hasClass('act')) {
                $title.parent().addClass('act');
                $content.show();
            }

            $title.off('click').on('click', function () {
                if ($title.hasClass('act')) {
                    $title.removeClass('act');
                    $title.parent().removeClass('act');
                    $content.slideUp();
                } else {
                    $accordion.find('.nov-accordion__title').removeClass('act');
                    $accordion.find('.nov-accordion__content').slideUp();
                    $accordion.find('.nov-accordion__item').removeClass('act');

                    $title.addClass('act');
                    $title.parent().addClass('act');
                    $content.slideDown();
                }
            });
        });
    });
};
novtheme.ObserverActive = function() {

    function observeIntersection(elements) {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                const $element = $(entry.target);
                
                if (entry.isIntersecting) {
                    $element.addClass('act');
                } else {
                    $element.removeClass('act');
                }
            });
        };
        elements.each(function(index, element) {
            const elementMargin = $(element).data('margin') || '0px'; 
            const elementOptions = { rootMargin: elementMargin };
            
            const observer = new IntersectionObserver(observerCallback, elementOptions);
            observer.observe(element);
        });
    }
    
    const allObservedElements = $('.js-observe-act'); 
    observeIntersection(allObservedElements);
};
novtheme.LookBook = function() {
    if ($('.item-lookbook').length > 0) {
        $('.item-lookbook').each(function () {
            var el = $(this),
            el_c = $(this).children('.content-lookbook'),
            t = el.position().top,
            l = el.position().left,
            ew = el.outerWidth(),
            h = el.offsetParent().height(),
            w = el.offsetParent().width(),
            c = el_c.width();
            if (w/2 < l) {
                el_c.css('right', (ew - 40)/2 + 52).addClass('p-left');
                if (w - l + c > w) {
                    el_c.css('margin-right', (w - l + c - w) * -1)
                }
            } else {
                el_c.css('left', (ew - 40)/2 + 52).addClass('p-right');
                if (l + ew + c > w) {
                    el_c.css('margin-left', (l + ew + c - w) * -1)
                }
            }
            /*if (h/2 < t) {
                if ($(window).width > 575) {
                    el_c.css('bottom', '60px')
                } else {
                    el_c.css('bottom', '35px')
                }
            } else {
                if ($(window).width > 575) {
                    el_c.css('top', '60px')
                } else {
                    el_c.css('top', '35px')
                }
            }*/
        })
    }
    $('.section-lookbook-product').each(function(){
        $(this).find('.nov_item_act').click(function(){
            var data = $(this).data('act');
            $(this).siblings().removeClass('act');
            $(this).parents('.container-inner').find('.nov_btn_act').removeClass('act');
            $(this).addClass('act');
            $('[data-toggle="'+ data +'"]').addClass('act');
        });
    });
};
novtheme.LanguageCountry = function() {
    $('.nov-language, .nov-country').each(function() {
        var el = $(this),
        input = el.find('input[name="locale_code"], input[name="country_code"]'),
        item =  el.find('.item');
        if (el.hasClass('flag')) {
            var flag = el.find('.active .flag-icon').html();
            el.find('.nov_ud_btn').prepend('<span class="flag-icon"></span>');
            el.find('.nov_ud_btn .flag-icon').html(flag);
        }
        item.click(function() {
            var value = $(this).data('value');
            input.val(value);
            el.submit();
        });
    });
};
novtheme.CartExtent = function() {
    var close = theme.strings.close_mini_canvas;
    $(document).on('click', '.extend--label__item', function(){
        var dataTitle = $(this).data('label'),
            item = $('.extend--label__item'),
            label = $('.cart_extend--label'),
            cartExtend = $('.cart_extend');
        if ($(this).hasClass("act")) {
            $(this).removeClass('act');
            cartExtend.removeClass('act');
            label.removeClass('act');
            $(this).attr('data-original-title', dataTitle);
        } else {
            var siblings = $(this).siblings();
            siblings.each(function () {
               var sibTitle = $(this).data('title');
               siblings.removeClass('act');
               $(this).attr('data-original-title', sibTitle);
            })
            cartExtend.removeClass('act');
            label.removeClass('act');
            $(this).addClass('act');
            $(this).attr('data-original-title', close);
            $('.cart_extend[data-content="' + dataTitle + '"]').addClass('act');
            label.addClass('act');
        }
        if (responsive_mobile) {
            $('.block_cart_canvas #desktop_cart').addClass('open-extend');
        }
    });
    $('.extend--label__item').hover(function(){
        var title = $(this).attr('title');
        if ($(this).hasClass("act")) {
            $(this).attr('data-original-title', close);
        } else {
            $(this).attr('data-original-title', title);
        }
    },function(){
        if ($(this).hasClass("act") && typeof title !== "undefined") {
            $(this).attr('data-original-title', title);
        } else {
            $(this).attr('data-original-title', close);
        }
    });
    $(document).on('click', '.cart_extend--btn', function(){
        $('.cart_extend, .cart_extend--label, .extend--label__item').removeClass('act')
        if (responsive_mobile) {
            $('.block_cart_canvas #desktop_cart').removeClass('open-extend');
        }
    });
    $(document).on('click', '.btn_save--discount', function(){
        var val = $(this).parent().find('input').val();
        $('.js-form-discount').val(val);
        $.cookie('discountCode', val, 30);
    });

    setTimeout(function() {
        var discountCode = $.cookie('discountCode');
        if (discountCode && discountCode.length) {
            $('.cart_extend--input[name="discount"]').val(discountCode);
        }
    }, 1000);
    
    if (responsive_mobile) {
        var height = $('#desktop_cart.item_count .block_cart_top').height();
        var flag = true;
        var offsetTop = 0;
        $('#desktop_cart').scroll(function() {
            var scrollTop = $('#desktop_cart').scrollTop();
            if (scrollTop > height) {
                $('#desktop_cart.item_count .block_cart_top').addClass('scroll-down');
            } else {
                $('#desktop_cart.item_count .block_cart_top').removeClass('scroll-down');
            }
            if (scrollTop < offsetTop && scrollTop > height) {
                if (flag == true) {
                    $('#desktop_cart.item_count .block_cart_top').removeClass('scroll-down').addClass('sticky-sm');
                    flag = false;
                }
            } else {
                if (flag == false) {
                    $('#desktop_cart.item_count .block_cart_top').addClass('scroll-down').removeClass('sticky-sm');
                    flag = true;
                }
            }
            offsetTop = scrollTop;
        });
    }
};
novtheme.AddActive = function() {
    $('.nov_btn_act').click(function(){
        var data = $(this).data('toggle');
        var overlay = $(this).data('overlay');
    
        var parent = $(this).closest('.data-act-parent');
        if (parent.length === 0) {
            parent = $(this).closest('.container-inner');
        }
        $(this).siblings().removeClass('act');
        parent.find('.nov_item_act').removeClass('act');
    
        if ($(this).hasClass('act')) {
            $(this).removeClass('act');
            $('[data-act="'+ data +'"]').removeClass('act');
            if (overlay === true) {
                sidebarOverlay.removeClass('act').removeAttr('data-close');
            }
        } else {
            $(this).addClass('act');
            $('[data-act="'+ data +'"]').addClass('act');
            if (overlay === true) {
                sidebarOverlay.addClass('act').attr('data-close', data);
            }
        }
    });
    
    $('.nov_btn_close').click(function(){
        var data = $(this).data('close');
        $('[data-act="'+ data +'"], .sidebar-overlay, .nov_btn_act').removeClass('act');
        sidebarOverlay.removeAttr('data-close');
    });
    $('[data-toggle="modal"]').click(function() {
        $('.nov_btn_act, .nov_item_act').removeClass('act');
        sidebarOverlay.removeClass('act');
    })
    $('[btn-toggle]').click(function () {
        var toggle = $(this).data('toggle');
        $(this).toggleClass('act');
        $('[nov-toggle="'+ toggle +'"]').slideToggle(400);
    })
};
novtheme.ParallaxImage = function() {
    if (currentWidth > 1023) {
        $('.img_animate').each(function() {
            var el = $(this);
            el.parallax();
        });
    }
};
novtheme.CollectionTab = function() {
    $('.nav-mobile').each(function(){
        var el = $(this);
        var t = el.find('.active').text();
        var h = el.find('.nav-mobile__title');
        h.text(t);
        el.find('.nav-link').click(function(){
            h.text($(this).text());
            $('.nov_ud_toggle').each(function(){
                var ud = $(this);
                ud.find('.nov_ud_dropdown').slideUp();
                ud.find('.nov_ud_group').removeClass('act');
            });
        })
    })
}
novtheme.ParallaxImageScrollHorizontal = function () {
    'use strict';

    if (novtheme.ParallaxImageScrollHorizontal._initialized) {
        novtheme.ParallaxImageScrollHorizontal._cache();
        return;
    }

    let winHeight = window.innerHeight;
    let ticking   = false;
    let items     = [];

    function cacheElements() {
        winHeight = window.innerHeight;
        items     = [];

        $('.js-img-parallax.act').each(function () {
            const scale = parseFloat($(this).data('scale')) || 1.2;
            items.push({
                el:        this,
                offsetTop: $(this).offset().top,
                scale:     scale,
            });
        });
    }

    function updateParallax() {
        const scrollTop = window.pageYOffset;

        for (let i = 0; i < items.length; i++) {
            const item        = items[i];
            const elHeight    = item.el.offsetHeight;
            const totalTravel = winHeight + elHeight;
            const progress    = scrollTop - (item.offsetTop - winHeight);

            if (progress < 0 || progress > totalTravel) continue;

            const ratio    = progress / totalTravel;
            const maxShift = (elHeight * (item.scale - 1)) / 2;
            const scrolled = maxShift - ratio * maxShift * 2;

            item.el.style.transform = 'translateY(' + scrolled.toFixed(2) + 'px)';
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            cacheElements();
            updateParallax();
        }, 200);
    }

    novtheme.ParallaxImageScrollHorizontal._cache       = cacheElements;
    novtheme.ParallaxImageScrollHorizontal._initialized = true;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    cacheElements();
    updateParallax();

    window.addEventListener('load', function () {
        cacheElements();
        updateParallax();
    });

    setTimeout(function () { cacheElements(); updateParallax(); }, 500);
    setTimeout(function () { cacheElements(); updateParallax(); }, 1500);
};
novtheme.NumberAnimate = function() {
    const targetElement = $('.number-animate');
    if (targetElement.length) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    targetElement.each(function () {
                        var el = $(this);
                        var delay = el.hasClass('first-load') ? 1500 : 200;

                        if (!el.hasClass('act')) {
                            el.addClass('act');
                            var rawNumber = el.attr('data-number');
                            let displayFormat;
                            let parsedNumber;
                            let decimalPlaces = 0;

                            if (rawNumber.indexOf(',') > -1 && rawNumber.indexOf('.') === -1) {
                                displayFormat = ',';
                                parsedNumber = parseFloat(rawNumber.replace(',', '.'));
                                const parts = rawNumber.split(',');
                                decimalPlaces = parts.length > 1 ? parts[1].length : 0;
                            } else if (rawNumber.indexOf('.') > -1 && rawNumber.indexOf(',') === -1) {
                                displayFormat = '.';
                                parsedNumber = parseFloat(rawNumber);
                                const parts = rawNumber.split('.');
                                decimalPlaces = parts.length > 1 ? parts[1].length : 0;
                            } else if (rawNumber.indexOf(',') > -1 && rawNumber.indexOf('.') > -1) {
                                displayFormat = '.';
                                parsedNumber = parseFloat(rawNumber.replace(/,/g, ''));
                                const parts = rawNumber.split('.');
                                decimalPlaces = parts.length > 1 ? parts[1].length : 0;
                            } else {
                                displayFormat = '.';
                                parsedNumber = parseFloat(rawNumber);
                                decimalPlaces = 0;
                            }

                            el.prop('number', 0).delay(delay).animate({
                                number: parsedNumber
                            }, {
                                duration: 2000,
                                easing: 'linear',
                                step: function (e) {
                                    let text;
                                    if (decimalPlaces > 0) {
                                        if (displayFormat === ',') {
                                            text = e.toFixed(decimalPlaces).replace('.', ',');
                                        } else {
                                            text = e.toFixed(decimalPlaces);
                                        }
                                    } else {
                                        text = Math.ceil(e);
                                    }
                                    $(this).text(text);
                                }
                            });
                        }
                    });
                }
            });
        });

        targetElement.each(function () {
            observer.observe(this);
        });
    }
};
novtheme.FakeOrder = function() {
    const INITIAL_DELAY = 5000; 

    function getRandomData(dataContainer, selector, dataAttribute) {
        const items = dataContainer.find(selector);
        if (items.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * items.length);
        return items.eq(randomIndex).data(dataAttribute);
    }

    function insertRandomData($fakeOrder, $orderData, $elements) {
        if ($fakeOrder.hasClass('act')) {
            $fakeOrder.removeClass('act');
            return;
        }

        const data = {
            imgSrc: getRandomData($orderData, '.product-item', 'img'),
            title: getRandomData($orderData, '.product-item', 'title'),
            productLink: getRandomData($orderData, '.product-item', 'src'),
            time: getRandomData($orderData, '.time-item', 'time'),
            local: getRandomData($orderData, '.location-item', 'local'),
            name: getRandomData($orderData, '.name-item', 'name')
        };

        if (!data.imgSrc || !data.title) {
            return;
        }

        $elements.productImage.attr('href', data.productLink);
        $elements.productImage.html(`<img src="${data.imgSrc}" alt="${data.title || ''}">`);

        $elements.productTitle.html(data.title).attr('href', data.productLink);
        $elements.productTime.html(data.time || '');
        $elements.productName.html(data.name || '');
        $elements.productLocal.html(data.local || '');

        $fakeOrder.addClass('act');
    }

    setTimeout(() => {
        const $fakeOrder = $('#nov-popup-fake-order');

        if ($fakeOrder.length === 0) {
            return;
        }

        const $orderData = $('#fake-order-data');
        const $closefakeOrder = $fakeOrder.find('.close-popup');
        const timeInterval = $fakeOrder.data('time') || 5000;

        const $elements = {
            productImage: $fakeOrder.find('.product-image'),
            productTitle: $fakeOrder.find('.product-title'),
            productTime: $fakeOrder.find('.time'),
            productName: $fakeOrder.find('.name'),
            productLocal: $fakeOrder.find('.local')
        };
        
        const mobileDisabled = $fakeOrder.data('xs') === false;
        if (mobileDisabled && typeof currentWidth !== 'undefined' && currentWidth < 576) {
            $fakeOrder.remove();
            return;
        }

        let intervalId = null;

        if ($.cookie('FakeOrder') !== 'closed') {
            insertRandomData($fakeOrder, $orderData, $elements); 
            
            intervalId = setInterval(() => {
                if ($.cookie('FakeOrder') === 'closed') {
                    clearInterval(intervalId);
                    $fakeOrder.removeClass('act');
                    return;
                }
                insertRandomData($fakeOrder, $orderData, $elements);
            }, timeInterval);
        } 

        $closefakeOrder.off('click').on('click', function() {
            $.cookie('FakeOrder', 'closed', { expires: 1, path: '/' });
            $fakeOrder.removeClass('act');
            if (intervalId) {
                clearInterval(intervalId);
            }
        });

    }, INITIAL_DELAY);
};
novtheme.VerticalMenu = function() {
    var el = $('.site-nav-vertical');
    $('.btn-vertical').off('click').on('click', function () {
        $('.system-vertical-menu').toggleClass('open_menu');
        sidebarOverlay.addClass('act');
        if($(window).width() > 1199 ) {
            // el.slideToggle(400);
            $(this).toggleClass('act');
        } else {
            el.addClass('act');
            sidebarOverlay.addClass('act');
        }
    });
    // Show sub menu canvas tablet
    el.find('.site-nav__link--main .nav-direc').off('click').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parents('.nav--lv1').find('.nav-dropdown--lv1').slideUp(300);
        } else {
            $('.site-nav-vertical .nav-dropdown--lv1').slideUp(300);
            $('.site-nav-vertical .site-nav__link--main .nav-direc').removeClass('active');
            $(this).addClass('active');
            $(this).parents('.nav--lv1').find('.nav-dropdown--lv1').slideDown(300);
        }
    });

    // Show sub children menu canvas tablet
    $('.site-nav-vertical .site-nav__link--second .nav-direc').off('click').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parents('.nav--lv2').find('.nav-dropdown--lv2').slideUp(300);
        } else {
            $('.site-nav-vertical .nav-dropdown--lv2').slideUp(300);
            $('.site-nav-vertical .site-nav__link--second .nav-direc').removeClass('active');
            $(this).addClass('active');
            $(this).parents('.nav--lv2').find('.nav-dropdown--lv2').slideDown(300);
        }
    });

    let desktopContent = $('#DesktopVerticalMenu');
    let mobileContent = $('#MobileVerticalMenu');

    if ($(window).width() < 1200) {
        if (desktopContent.children().length) {
            mobileContent.append(desktopContent.children().detach());
            if ($('.site-nav-vertical').hasClass('act')) {
                sidebarOverlay.addClass('act');
            }
        }
    } else {
        if (mobileContent.children().length) {
            desktopContent.append(mobileContent.children().detach());
            sidebarOverlay.removeClass('act');
        }
    }
};
novtheme.OverlayBlur = function () {
    var hoverTimer;
    $('.nov_overlay_blur').each(function() {
        var overlayBlur = $(this);
        var respon = '';
            respon = overlayBlur.data('respon');
        if (typeof respon === 'undefined') {
            respon = 1;
        }
        if (currentWidth >= respon) {
            overlayBlur.hover(
                function() {
                    hoverTimer = setTimeout(function() {
                        $('body').append('<div class="overlay-blur"></div>');
                        var offsetTop = overlayBlur.offset().top;
                        var height = overlayBlur.outerHeight();
                        var overlayHeight = $(window).height() * 2 - offsetTop - height;
                        $('.overlay-blur').css({'height': overlayHeight, 'top': offsetTop + height, 'z-index': '2'});
                    }, 150);
                },
                function() {
                    clearTimeout(hoverTimer);
                    $('body').find('.overlay-blur').fadeOut(200, function() {
                        $(this).remove();
                    });
                }
            );
        }  
    });
};
novtheme.ToggleUpDown = function () {
    $('.nov_ud_toggle').each(function(){
        var el = $(this),
            btn = el.find('.nov_ud_btn'),
            dropdown = el.find('.nov_ud_dropdown'),
            group = el.find('.nov_ud_group'),
            repon = el.data('ud_respon'),
            collapse = el.data('ud_collapse');
        
        if (typeof repon !== 'undefined') {
            if ($(window).width() <= repon) {
                btn.on('click', function() {
                    var groupA = $(this).closest(group);
                    if (collapse == true) {
                       groupA.siblings().removeClass('act').find(dropdown).slideUp();
                    }
                    groupA.toggleClass('act').find(dropdown).slideToggle();
                });
            }
        } else {
            btn.on('click', function() {
                var groupA = $(this).closest(group);
                if (collapse == true) {
                   groupA.siblings().removeClass('act').find(dropdown).slideUp();
                }
                groupA.toggleClass('act').find(dropdown).slideToggle();
            });
            $(document).on("click", function(event){
                if(!$(event.target).closest(el).length){
                    el.find(dropdown).slideUp();
                    group.removeClass('act')
                }
            });
        }
    });
};
novtheme.Comparisons = function () {
    $(".content-img-compare").each(function () {
        $(this).find(".nov-before-after .nov-ba-wrap:not(.init)").each(function () {
            initBeforeAfterEl($(this).addClass("init"));
        });
    });

    function initBeforeAfterEl($container) {
        const $parentElement = $container.closest(".content-img-compare");
        const $before = $parentElement.find(".before");
        const $handle = $parentElement.find(".handle");
        const $beforeHeader = $parentElement.find(".nov-before-header");
        const $afterHeader = $parentElement.find(".nov-after-header");
        const maxX = $container.outerWidth();
        const offsetX = $container.offset().left;

        function updatePosition(clientX) {
            let curPos = ((clientX - offsetX) / maxX) * 100;
            curPos = Math.max(0, Math.min(curPos, 100));

            $before.css({ right: 100 - curPos + "%" });
            $handle.css({ left: curPos + "%" });
            $beforeHeader.css({ opacity: 1 - (100 - curPos) / 100 });
            $afterHeader.css({ opacity: (100 - curPos) / 100 });
        }

        function handleMove(e) {
            updatePosition(e.type.includes('touch') ? e.originalEvent.changedTouches[0].pageX : e.clientX);
        }

        function handleUp() {
            $(document).off("mousemove touchmove", handleMove).off("mouseup touchend", handleUp);
        }

        function handleDown(e) {
            updatePosition(e.type.includes('touch') ? e.originalEvent.changedTouches[0].pageX : e.clientX);
            $(document).on("mousemove touchmove", handleMove).on("mouseup touchend", handleUp);
        }

        $handle.on('ontouchstart' in window ? "touchstart" : "mousedown", handleDown);
    }
};
novtheme.Marquee = function() {
    $('.nov-marquee').each(function () {
        $(this).find('.block-marquee-item').each(function () {
            const $clone = $(this).clone(true);
            $(this).after($clone);
        });
    
        setTimeout(() => {
            $(this).addClass('animating');
        }, 500);
    });
};
novtheme.TextAnimate = function() {
    const el = $('.text-animate-js');

    function observeIntersection(elements) {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                const $element = $(entry.target);

                if (entry.isIntersecting && !$element.data('animated')) {
                    $element.data('animated', true);

                    var words = $element.text(),
                        arrayString = [words],
                        part = "",
                        offset = 0,
                        speed = 70;

                    const wordflick = function () {
                        if (offset <= arrayString[0].length) {
                            part = arrayString[0].substr(0, offset);
                            $element.text(part);
                            offset++;

                            setTimeout(wordflick, speed);
                        }
                    };
                    wordflick();
                }
            });
        };

        const margin = elements.data('margin') || "0px";
        const options = {
            rootMargin: margin
        };

        elements.each(function (index, element) {
            const observer = new IntersectionObserver(observerCallback, options);
            observer.observe(element);
        });
    }
    observeIntersection(el);
};
novtheme.ElementHeight = function() {
    $('.js-height').each(function () {
        var height = this.scrollHeight; 
        $(this).css('--height', height + 'px');
    });
    $('.content-partial-reveal').each(function () {
        var height = $(this).find(' > div:first-child').outerHeight(); 
        $(this).css('--first-child-height', height + 'px');
    });
}
novtheme.ImageSplitWithText = function() {
    if ($('.split-image__column').length > 0) {
        if($(window).width() > 991 ) {
            $('.split-image__column').hover(function(){
                $(this).addClass('act');
                $(this).siblings().removeClass('act');
            });
        }
        if($(window).width() < 992 ) {
            $('.split-image__column').click(function(event){
                $(this).addClass('act');
                $(this).siblings().removeClass('act');
            });
            
            $(document).on('click', function(event) {
                if (!$(event.target).closest('.split-image__column').length) {
                    $('.split-image__column').removeClass('act');
                }
            });
        }
    }
}
novtheme.ProgressBar = function() {
    class ProgressBar extends HTMLElement {
      constructor() {
        super();
        this.isAnimated = false;
      }

      connectedCallback() {
        this.targetValue = parseInt(this.dataset.targetValue) || 0;
        this.maxValue = parseInt(this.dataset.maxValue) || 100;
        this.animationDuration = parseFloat(this.dataset.animationDuration) || 2;
        this.showPercentage = this.dataset.showPercentage === 'true';
        this.showValues = this.dataset.showValues === 'true';
        this.valuePrefix = this.dataset.valuePrefix || '';
        this.valueSuffix = this.dataset.valueSuffix || '';

        this.progressFill = this.querySelector('.progress-bar-fill');
        this.percentageDisplay = this.querySelector('.progress-bar-percentage');
        this.currentValueDisplay = this.querySelector('.progress-bar-current-value');

        this.setupIntersectionObserver();
      }

      setupIntersectionObserver() {
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.isAnimated) {
              this.animateProgress();
              this.isAnimated = true;
            }
          });
        }, options);

        this.observer.observe(this);
      }

      animateProgress() {
        const targetPercentage = Math.min((this.targetValue / this.maxValue) * 100, 100);
        const steps = 60;
        let currentStep = 0;

        const animate = () => {
          currentStep++;
          const progress = currentStep / steps;
          const easedProgress = this.easeOutCubic(progress);
          
          const currentPercentage = easedProgress * targetPercentage;
          const currentValue = Math.round(easedProgress * this.targetValue);

          this.progressFill.style.width = currentPercentage + '%';

          if (this.showPercentage && this.percentageDisplay) {
            this.percentageDisplay.textContent = Math.round(currentPercentage) + '%';
          }

          if (this.showValues && this.currentValueDisplay) {
            this.currentValueDisplay.textContent = this.valuePrefix + currentValue + this.valueSuffix;
          }

          if (currentStep < steps) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }

      easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      disconnectedCallback() {
        if (this.observer) {
          this.observer.disconnect();
        }
      }
    }
    customElements.define('progress-bar', ProgressBar);
}
// novtheme.CustomWow = function() {
//     function initCustomWow() {
//         const wowItems = document.querySelectorAll('[data-animated-item="true"]');
        
//         const observerOptions = {
//             root: null,
//             rootMargin: '0px 0px -10% 0px', 
//             threshold: 0.1
//         };
    
//         const handleAnimationEnd = (event) => {
//             const element = event.target;
//             element.classList.remove('animated');
//             element.removeEventListener('animationend', handleAnimationEnd);
//         };
    
//         const triggerAnimation = (element, observer) => {
//             const delayAttr = element.getAttribute('data-animated-delay');
//             const animationName = element.getAttribute('data-animated-name');
    
//             observer.unobserve(element);
    
//             if (!animationName) return;
    
//             const delayMs = delayAttr ? parseFloat(delayAttr) * 1000 : 0;
    
//             setTimeout(() => {
//                 element.style.animationName = animationName;
//                 element.style.visibility = 'visible';
//                 element.classList.add('animated', 'wowact');
//                 element.addEventListener('animationend', handleAnimationEnd, { once: true });
//             }, parseFloat(delayMs));
//         };
    
//         const observerCallback = (entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     triggerAnimation(entry.target, observer);
//                 }
//             });
//         };
    
//         const observer = new IntersectionObserver(observerCallback, observerOptions);
    
//         wowItems.forEach(item => {
//             observer.observe(item); 
//         });
//         window.addEventListener('scroll', () => {
//             if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
//                 const remainingItems = document.querySelectorAll('[data-animated-item="true"]:not(.wowact)');
//                 remainingItems.forEach(item => {
//                     triggerAnimation(item, observer);
//                 });
//             }
//         }, { passive: true });
//     }
//     initCustomWow();
// }
novtheme.NovMobileMenu = function() {
    const $siteNavMobile = $(".site-nav-mobile");
    $siteNavMobile.on('click', '.direc1, .direc2, .direcback1, .direcback2', function(event) {
        const $clickedElement = $(this);
        const className = $clickedElement.attr('class');
        if (className && (className.includes('direc1') || className.includes('direc2'))) {
            const groupSelector = className.includes('direc1') ? '.direc1' : '.direc2';
            $clickedElement.addClass('act');
            $siteNavMobile.find(groupSelector).not($clickedElement).removeClass('act');
        } else if (className && className.includes('direcback1')) {
            $siteNavMobile.find('.direc1').removeClass('act');
        } else if (className && className.includes('direcback2')) {
            $siteNavMobile.find('.direc2').removeClass('act');
        }
    });
}
novtheme.NovImageLink = function() {
    const section = document.querySelector('.section-img-link');
    if (!section) return;

    const thumbnail = document.createElement('div');
    thumbnail.className = 'link-item-thumbnail';
    thumbnail.innerHTML = '<div class="thumbnail-inner"><img src="" alt=""></div>';
    document.body.appendChild(thumbnail);

    const thumbImg = thumbnail.querySelector('img');
    const linkItems = section.querySelectorAll('.link-item');
    const slickSlides = section.querySelectorAll('.img-item');

    const imageSources = [];
    slickSlides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      imageSources[i] = img ? img.src : '';
    });

    linkItems.forEach((item, index) => {
      item.addEventListener('mouseenter', function() {
        if (imageSources[index]) {
          thumbImg.src = imageSources[index];
          thumbnail.classList.add('visible');
        }
      });

      item.addEventListener('mouseleave', function() {
        thumbnail.classList.remove('visible');
      });

      item.addEventListener('mousemove', function(e) {
        const offsetX = 10;
        const offsetY = 10;
        let x = e.clientX + offsetX;
        let y = e.clientY + offsetY;

        const thumbW = thumbnail.offsetWidth;
        const thumbH = thumbnail.offsetHeight;
        if (x + thumbW > window.innerWidth) x = e.clientX - thumbW - offsetX;
        if (y < 0) y = e.clientY + 20;
        if (y + thumbH > window.innerHeight) y = window.innerHeight - thumbH - 10;

        thumbnail.style.left = x + 'px';
        thumbnail.style.top = y + 'px';
      });
    });
}
novtheme.ScrollView = function() {
    if ($('.nov-scroll-view').length > 0) {
        window.addEventListener('scroll', () => {
            const container = document.querySelector('.nov-scroll-view');
            const blocks = container.querySelectorAll(':scope > .group-block');
        
            const containerRect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
        
            const scrollTop = Math.min(Math.max(-containerRect.top, 0), containerHeight - window.innerHeight);
            const scrollProgress = scrollTop / (containerHeight - window.innerHeight);
        
            blocks.forEach((block, i) => {
                block.style.top = `${14 + i * 3}vh`;
                const remain = blocks.length - i - 1;
                block.style.marginBottom = `${remain * 4}vh`;
                const maxBlocks = blocks.length;
                const minScale = 0.9 + (i / (maxBlocks - 1)) * (1 - 0.9);
                const scale = 1 - (1 - minScale) * scrollProgress;
                block.style.transform = `scale(${scale})`;
            });
        });
    }
}
novtheme.PageMenuService = function() {
    var main = document.getElementById('MainContent');
    if (!main) return;

    var menuServiceSection = document.querySelector('.section-menu-service');
    var menuEl = menuServiceSection ? menuServiceSection.querySelector('.menu-service') : null;
    if (!menuEl) return;

    var sections = Array.from(main.querySelectorAll(':scope > [id^="shopify-section-"]'));
    var items = Array.from(menuEl.querySelectorAll('.mn-sv-item[data-index]'));
    if (!items.length) return;

    var indices = items.map(function (item) {
        return parseInt(item.getAttribute('data-index'), 10);
    });

    var minIndex = Math.min.apply(null, indices);
    var maxIndex = Math.max.apply(null, indices);

    var firstSection = sections[minIndex - 1];
    var lastSection  = sections[maxIndex - 1];
    if (!firstSection || !lastSection) return;

    function getOffsetTop(el) {
        var top = 0;
        while (el) { top += el.offsetTop; el = el.offsetParent; }
        return top;
    }

    function setActive(index) {
        items.forEach(function (item) {
            var idx = parseInt(item.getAttribute('data-index'), 10);
            item.classList.toggle('act', idx === index);
        });
    }

    items.forEach(function (item, i) {
        var targetEl = sections[indices[i] - 1];
        if (targetEl) item.setAttribute('href', '#' + targetEl.id);

        item.addEventListener('click', function (e) {
            setActive(indices[i]);
            if (indices[i] === minIndex) {
                e.preventDefault();
                window.scrollTo({ top: getOffsetTop(firstSection) - 1 });
            }
        });
    });

    menuEl.style.position = 'fixed';

    var centeredTop = (window.innerHeight - menuEl.offsetHeight) / 2;

    function updateSidebarPosition() {
        var scrollY    = window.pageYOffset;
        var firstTop   = getOffsetTop(firstSection);
        var lastTop    = getOffsetTop(lastSection);
        var lastHeight = lastSection.offsetHeight;
        var menuHeight = menuEl.offsetHeight;
        var clampedTop = lastTop + lastHeight - menuHeight - scrollY;

        if (scrollY < firstTop) {
            menuEl.style.top = (firstTop - scrollY) + 'px';
        } else if (clampedTop < centeredTop) {
            menuEl.style.top = clampedTop - 60 + 'px';
        } else {
            menuEl.style.top = centeredTop + 'px';
        }
    }

    function updateActiveItem() {
        var scrollY     = window.pageYOffset;
        var middle      = scrollY + window.innerHeight / 2;
        var activeIndex = minIndex;
    
        indices.forEach(function (idx) {
            var targetEl = sections[idx - 1];
            if (!targetEl) return;
            if (middle >= getOffsetTop(targetEl)) {
                activeIndex = idx;
            }
        });
    
        setActive(activeIndex);
    }

    window.addEventListener('scroll', function () {
        updateSidebarPosition();
        updateActiveItem();
    }, { passive: true });

    window.addEventListener('resize', function () {
        centeredTop = (window.innerHeight - menuEl.offsetHeight) / 2;
        updateSidebarPosition();
    }, { passive: true });

    updateSidebarPosition();
    updateActiveItem();
}
novtheme.ProductBundle = function() {
    $('.section-product-bundle').each(function() {
        var $section = $(this);
        var minItems = parseInt($section.data('min-items')) || 3;
        var maxItems = parseInt($section.data('max-items')) || 3;
        var preventDuplicate = $section.data('prevent-duplicate') !== false && $section.data('prevent-duplicate') !== 'false';
        var allowQty = $section.data('allow-qty') !== false && $section.data('allow-qty') !== 'false';
        var qtyIncrement = parseInt($section.data('qty-increment')) || 1;
        var qtyMin = parseInt($section.data('qty-min')) || 1;

        var bundleItems = [];

        function updateBundleUI() {
            var $itemsContainer = $section.find('.nov-bundle-items');
            var $progressFill = $section.find('.bundle-progress-fill');
            var $totalPrice = $section.find('.total-price');
            var $cartBtn = $section.find('.btn-bundle-add-to-cart');

            var count = bundleItems.length;
            var pct = Math.min(100, Math.round((count / maxItems) * 100));
            $progressFill.css('width', pct + '%');

            $itemsContainer.empty();
            var totalCents = 0;

            for (var i = 0; i < maxItems; i++) {
                if (i < count) {
                    var item = bundleItems[i];
                    totalCents += item.price * item.qty;
                    var itemMoney = typeof Shopify !== 'undefined' && Shopify.formatMoney ? Shopify.formatMoney(item.price, theme.moneyFormat) : '$' + (item.price / 100).toFixed(2);

                    var qtyHtml = '';
                    if (allowQty) {
                        qtyHtml = '<div class="bundle-item-qty d-flex align-items-center justify-content-center mb-5">' +
                            '<button type="button" class="qty-btn bundle-qty-minus" data-index="' + i + '">-</button>' +
                            '<input type="number" class="bundle-item-qty-input" data-index="' + i + '" value="' + item.qty + '" min="' + qtyMin + '" step="' + qtyIncrement + '" readonly>' +
                            '<button type="button" class="qty-btn bundle-qty-plus" data-index="' + i + '">+</button>' +
                            '</div>';
                    } else {
                        qtyHtml = '<div class="bundle-item-qty-single d-none mb-5">Qty: ' + item.qty + '</div>';
                    }

                    var itemHtml = '<div class="nov-bundle-item item-filled d-flex align-items-center justify-content-between" data-index="' + i + '" data-variant-id="' + item.variantId + '">' +
                        '<div class="d-flex align-items-center gap-12 flex-grow-1 overflow-hidden mr-10">' +
                        '<div class="bundle-item-media flex-shrink-0">' +
                        '<img src="' + item.image + '" alt="' + (item.title || '').replace(/"/g, '&quot;') + '" class="w-100 h-100 object-cover">' +
                        '</div>' +
                        '<div class="bundle-item-info flex-grow-1 overflow-hidden">' +
                        '<div class="bundle-item-title text-truncate">' + item.title + '</div>' +
                        (item.variantTitle ? '<div class="bundle-item-variant text-truncate">' + item.variantTitle + '</div>' : '') +
                        '<div class="bundle-item-price">' + itemMoney + '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="bundle-item-actions d-flex flex-column align-items-end flex-shrink-0">' +
                        qtyHtml +
                        '<button type="button" class="bundle-item-remove" data-index="' + i + '">' + theme.icon_close + '</button>' +
                        '</div>' +
                        '</div>';
                    $itemsContainer.append(itemHtml);
                } else {
                    var placeholderHtml = '<div class="nov-bundle-item item-placeholder d-flex align-items-center" data-slot="' + (i + 1) + '">' +
                        '<div class="placeholder-thumb flex-shrink-0"></div>' +
                        '<div class="placeholder-details flex-grow-1 ml-15">' +
                        '<div class="placeholder-line line-title mb-8"></div>' +
                        '<div class="placeholder-line line-sub"></div>' +
                        '</div>' +
                        '</div>';
                    $itemsContainer.append(placeholderHtml);
                }
            }

            var formattedTotal = typeof Shopify !== 'undefined' && Shopify.formatMoney ? Shopify.formatMoney(totalCents, theme.moneyFormat) : '$' + (totalCents / 100).toFixed(2);
            if (formattedTotal && !formattedTotal.toLowerCase().includes('usd')) {
                formattedTotal += ' USD';
            }
            $totalPrice.text(formattedTotal);

            if (count >= minItems) {
                $cartBtn.removeClass('disabled').prop('disabled', false).css('pointer-events', 'auto');
            } else {
                $cartBtn.addClass('disabled').prop('disabled', true).css('pointer-events', 'none');
            }

            $section.find('.item-product').each(function() {
                var $card = $(this);
                var $btn = $card.find('.btn-add-to-bundle');
                var currentVarId = $card.find('input[name="id"]').val() || $card.attr('data-variant-id');
                var isAdded = bundleItems.some(function(it) { return String(it.variantId) === String(currentVarId); });

                if (count >= maxItems) {
                    $btn.addClass('max-reached').prop('disabled', true).css('pointer-events', 'none');
                } else if (isAdded && preventDuplicate) {
                    $btn.addClass('added').prop('disabled', true).css('pointer-events', 'none');
                } else {
                    $btn.removeClass('added max-reached').prop('disabled', false).css('pointer-events', 'auto');
                }
            });
        }

        $section.on('click', '.btn-add-to-bundle', function(e) {
            e.preventDefault();
            if (bundleItems.length >= maxItems) return;

            var $card = $(this).closest('.item-product');
            var variantId = $card.find('input[name="id"]').val() || $card.attr('data-variant-id');
            var productId = $card.attr('data-product-id');
            var title = $card.find('.product__title a').text().trim() || $card.attr('data-product-title') || 'Product';
            var variantTitle = $card.find('.item-swatch li .label.active').attr('data-title') || $card.attr('data-variant-title') || '';
            var price = parseInt($card.attr('data-price')) || 0;
            var image = $card.find('.product__thumbnail').attr('src') || $card.attr('data-image') || '';

            if (preventDuplicate && bundleItems.some(function(it) { return String(it.variantId) === String(variantId); })) {
                return;
            }

            bundleItems.push({
                variantId: variantId,
                productId: productId,
                title: title,
                variantTitle: variantTitle,
                price: price,
                image: image,
                qty: qtyMin
            });

            updateBundleUI();
        });

        $section.on('click', '.bundle-item-remove', function(e) {
            e.preventDefault();
            var index = $(this).data('index');
            if (index !== undefined && index >= 0 && index < bundleItems.length) {
                bundleItems.splice(index, 1);
                updateBundleUI();
            }
        });

        $section.on('click', '.bundle-qty-plus', function(e) {
            e.preventDefault();
            var index = $(this).data('index');
            if (index !== undefined && bundleItems[index]) {
                bundleItems[index].qty += qtyIncrement;
                updateBundleUI();
            }
        });

        $section.on('click', '.bundle-qty-minus', function(e) {
            e.preventDefault();
            var index = $(this).data('index');
            if (index !== undefined && bundleItems[index]) {
                if (bundleItems[index].qty - qtyIncrement >= qtyMin) {
                    bundleItems[index].qty -= qtyIncrement;
                    updateBundleUI();
                }
            }
        });

        $section.on('click change', '.item-swatch li .label, .selector-wrapper :radio, select.single-option-selector', function() {
            var $card = $(this).closest('.item-product');
            setTimeout(function() {
                var newVarId = $card.find('input[name="id"]').val();
                if (newVarId) {
                    $card.attr('data-variant-id', newVarId);
                    var jsonProductData = $card.data('json-product');
                    if (jsonProductData && jsonProductData.variants) {
                        var matchedVar = jsonProductData.variants.find(function(v) { return String(v.id) === String(newVarId); });
                        if (matchedVar) {
                            $card.attr('data-price', matchedVar.price);
                            if (matchedVar.featured_image && matchedVar.featured_image.src) {
                                $card.attr('data-image', matchedVar.featured_image.src);
                            }
                        }
                    }
                }
                updateBundleUI();
            }, 120);
        });

        $section.on('click', '.btn-bundle-add-to-cart', function(e) {
            e.preventDefault();
            var $btn = $(this);
            if ($btn.hasClass('disabled') || bundleItems.length < minItems) return;

            $btn.addClass('loading');
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            var itemsData = bundleItems.map(function(it) {
                return {
                    id: parseInt(it.variantId),
                    quantity: parseInt(it.qty)
                };
            });

            $.ajax({
                type: 'POST',
                url: baseUrl + '/cart/add.js',
                data: JSON.stringify({ items: itemsData }),
                contentType: 'application/json',
                dataType: 'json',
                success: function(cart) {
                    $.get(baseUrl + '/cart?view=json', function(data) {
                        $('#cart-info').html(data);
                    }).always(function() {
                        if (typeof theme !== 'undefined' && theme.cart_status === 'show_popup') {
                            var firstImg = bundleItems[0] ? bundleItems[0].image : '';
                            if (typeof nov !== 'undefined' && nov.initAddToCart) {
                                nov.initAddToCart(firstImg, 'Product Bundle');
                            }
                        }
                        if (!$('.form-cart__extent').length && typeof nov !== 'undefined' && nov.initCartExtend) {
                            nov.initCartExtend();
                        }
                        if (typeof nov !== 'undefined' && nov.updateMiniCart) {
                            nov.updateMiniCart();
                        } else if (typeof Shopify !== 'undefined' && Shopify.getCart) {
                            Shopify.getCart(function(c) {
                                $('.CartCount, #CartCountCavas').text(c.item_count);
                                $('#header-cart-total').html(Shopify.formatMoney(c.total_price, theme.moneyFormat));
                            });
                        }
                        if (typeof nov !== 'undefined' && nov.PopupAddToCart) {
                            nov.PopupAddToCart();
                        }
                        $btn.removeClass('loading');
                    });
                },
                complete: function() {
                    $('body').removeClass('loading');
                    if (typeof theme !== 'undefined' && theme.cart_status === 'show_minicart') {
                        setTimeout(function() {
                            $('#desktop_cart').addClass('active');
                            $('.sidebar-overlay').addClass('act');
                        }, 1000);
                    }
                },
                error: function(xhr) {
                    $btn.removeClass('loading');
                    var response = xhr.responseJSON;
                    var errorMessage = response && response.description ? response.description : 'Error adding bundle to cart';
                    alert(errorMessage);
                }
            });
        });

        updateBundleUI();
    });
};

$(document).ready(function() {
    $(novtheme.init);
    var timer = false;
    $(window).on('resize', function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function(){
            novtheme.CollectionPage();
            novtheme.toggleMobileStyles();
            novtheme.VerticalMenu();
            novtheme.ElementHeight();
            if ($(window).width() > 575) {
                $('.block_footer').find('.block-content.h_t').slideDown(300);
                $('.f_btn_sl').removeClass('active'); 
            } else {
                $('.block_footer').find('.block-content.h_t').slideUp(300);
            }
        }, 300);
    });
    if ($("#popup-subscribe").length) {
        $(window).on('load', function() {
            setTimeout(function() {
                novtheme.PopupNewletter();
            }, 2000);
        });
    }
    if ($("#popupAlert").length) {
        $(window).on('load', function() {
            $('#popupAlert').modal();
        });
        $("#popupAlert").click(function(){
            const url = window.location.href;
            const questionMarkIndex = url.indexOf('?customer');
            if (questionMarkIndex !== -1) {
                const previousLink = url.slice(0, questionMarkIndex);
                history.pushState({}, '', previousLink);
            }
        })
    }

    sidebarOverlay.on('click', function() {
        $(this).removeClass('act');
        var data = $(this).data('close');
        $('.cart_extend, .cart_extend--label, #mobile_menu, #show-megamenu, .site-nav--btn, .nov_item_act, .nov_btn_act, #MobileVerticalMenu, .site-nav-vertical').removeClass('act');
        $("#desktop_cart, #AccessibleNav").removeClass('active');
        body.css('overflow', 'auto').removeClass('open-canvans-cart, '+ data +'-open');
        body.removeClass('overflow_hidden');
        body.removeClass('minicart_open');
        $('.system-vertical-menu').removeClass('open_menu');
        $(this).removeAttr('data-close');
        $('.extend--label__item').removeClass('act').each(function() {
            var title = $(this).data('title');
            $(this).attr('data-original-title', title);
        });
    });

    // Animate load wislist page detail
    $('.group-quantity .btnProductWishlist').click(function () {
        if($(this).hasClass('whislist-added')) {
            $('#popup-Wishlist').removeClass('novload')
        } else {
            $('#popup-Wishlist').addClass('novload')
        }
    })
    
    // Zoom Product Image Page Detail
    function ZoomProductImage(elements) {
        const currentWidth = window.innerWidth;
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                const $element = $(entry.target);
                if (entry.isIntersecting) {
                    if (currentWidth >= 992) {
                        const alt = $element.find('img').attr('alt');
                        try {
                            $element.trigger('zoom.destroy');
                        } catch (error) {
                        }
                        $element
                            .wrap('<span class="w-100" style="display:block"></span>')
                            .css('display', 'block')
                            .parent()
                            .zoom({
                                url: $element.attr('data-zoom')
                            });
                        setTimeout(() => {
                            $element.parents('.item-content').find('.zoomImg').attr('alt', alt);
                        }, 500);
                    }
                    observer.unobserve(entry.target);
                }
            });
        };
        elements.each(function (index, element) {
            const observer = new IntersectionObserver(observerCallback);
            observer.observe(element);
        });
    }

    const el = $('.image-zoom');
    ZoomProductImage(el);

    // Form newletter product soldout
    $('.no-view').click(function () {
        if($('.contact-form').hasClass('add')) {
            $('.contact-form').removeClass('add')
        } else {
            $('.contact-form').addClass('add')
        }
    });

    // Accordion footer mobile
    $(".f_btn_sl").click(function(e) {
        if ($(this).hasClass("active")) {
            $(this).removeClass('active');
            $(this).parents('.menu-block').find('.block-content.h_t').slideUp(300);
        } else {
            $(this).addClass('active');
            $(this).parents('.menu-block').find('.block-content.h_t').slideDown(300);
        }
    });

    $(".faqs-main .panel-header").click(function(e) {
        if ($(this).hasClass("collapsed")) {
            $(".faqs-main").removeClass('active');
            $(this).parents('.faqs-main').addClass('active');
        } else {
            $(this).parents('.faqs-main').removeClass('active');
        }
    });

    // Q Custome js

    document.querySelectorAll('.flip-letters').forEach(function (el) {
        var text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach(function (char, i) {
            var span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = (i * 0.03) + 's';
            el.appendChild(span);
        });

        el.addEventListener('mouseenter', function () {
            el.querySelectorAll('span').forEach(function (s) {
                s.style.transform = 'translateY(-5px)';
            });
        });

        el.addEventListener('mouseleave', function () {
            el.querySelectorAll('span').forEach(function (s) {
                s.style.transform = 'translateY(0)';
            });
        });
    });

    // Fix Slick Slider ARIA focusable descendants issue for Lighthouse / Accessibility
    function fixSlickAccessibility($slider) {
        var $target = $slider && $slider.length ? $($slider) : $('.slick-slider');
        $target.each(function() {
            var $this = $(this);
            $this.find('.slick-slide[aria-hidden="true"]').find('a, button, input, select, textarea, [tabindex]').attr('tabindex', '-1');
            $this.find('.slick-slide[aria-hidden="false"]').find('a, button, input, select, textarea').removeAttr('tabindex');
        });
    }

    $(document).on('init reInit afterChange setPosition', '.slick-slider', function() {
        fixSlickAccessibility($(this));
    });

    fixSlickAccessibility();
    setTimeout(fixSlickAccessibility, 1000);
    setTimeout(fixSlickAccessibility, 3000);
})