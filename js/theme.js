window.theme = window.theme || {};
theme.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];
    $(document).on('shopify:section:load', this._onSectionLoad.bind(this)).on('shopify:section:unload', this._onSectionUnload.bind(this)).on('shopify:section:select', this._onSelect.bind(this)).on('shopify:section:deselect', this._onDeselect.bind(this)).on('shopify:block:select', this._onBlockSelect.bind(this)).on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
    _createInstance: function(container, constructor) {
        var $container = $(container);
        var id = $container.attr('data-section-id');
        var type = $container.attr('data-section-type');
        constructor = constructor || this.constructors[type];
        if (typeof constructor === 'undefined') {
            return;
        }
        var instance = Object.assign(new constructor(container), {
            id: id,
            type: type,
            container: container
        });
        this.instances.push(instance);
    },
    _onSectionLoad: function(evt) {
        var container = $('[data-section-id]', evt.target)[0];
        if (container) {
            this._createInstance(container);
        }
    },
    _onSectionUnload: function(evt) {
        this.instances = this.instances.filter(function(instance) {
            var isEventInstance = instance.id === evt.detail.sectionId;
            if (isEventInstance && typeof instance.onUnload === 'function') {
                instance.onUnload(evt);
            }
            return !isEventInstance;
        });
    },
    _onSelect: function(evt) {
        var instance = this.instances.find(function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (instance && typeof instance.onSelect === 'function') {
            instance.onSelect(evt);
        }
    },
    _onDeselect: function(evt) {
        var instance = this.instances.find(function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (instance && typeof instance.onDeselect === 'function') {
            instance.onDeselect(evt);
        }
    },
    _onBlockSelect: function(evt) {
        var instance = this.instances.find(function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (instance && typeof instance.onBlockSelect === 'function') {
            instance.onBlockSelect(evt);
        }
    },
    _onBlockDeselect: function(evt) {
        var instance = this.instances.find(function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (instance && typeof instance.onBlockDeselect === 'function') {
            instance.onBlockDeselect(evt);
        }
    },
    register: function(type, constructor) {
        this.constructors[type] = constructor;
        $('[data-section-type=' + type + ']').each(function(index, container) {
            this._createInstance(container, constructor);
        }.bind(this));
    }
});

window.theme = theme || {};
window.theme = window.theme || {};

theme.Nov_Slickcarousel = (function() {
    function Nov_Slickcarousel() {
        $('[data-section-type="nov-slick"]').each(function (argument) {
            var el = $(this);
            var sectionId = el.attr('data-section-id');
            var slider = el.find('.nov-slick-carousel');
            if ($('html').hasClass('lang-rtl'))
                var rtl = true;
            else
                var rtl = false;
            var items_xxl = slider.data("items_xxl"),
                items_xl = slider.data("items_xl"),
                items_lg = slider.data("items_lg"),
                items_md = slider.data("items_md"),
                items_sm = slider.data("items_sm"),
                items_xs = $(slider).data("items_xs") ? $(slider).data("items_xs") : 1,
                row_mobile = $(slider).data("row_mobile") ? $(slider).data("row_mobile") : 1,
                vertical = slider.data("vertical"),
                vertical_xl = slider.data("vertical_xl"),
                vertical_lg = slider.data("vertical_lg"),
                vertical_md = slider.data("vertical_md"),
                vertical_sm = slider.data("vertical_sm"),
                vertical_xs = slider.data("vertical_xs"),
                centerpadding = slider.data("centerpadding"),
                centerpadding_xl = slider.data("centerpadding_xl"),
                centerpadding_lg = slider.data("centerpadding_lg"),
                centerpadding_md = slider.data("centerpadding_md"),
                navfor = slider.data("navfor") ? slider.data("navfor"): false,
                appenddots = el.find('.append-dots'),
                isSliding = false;
            if (vertical == true) {
                rtl = false
            }
            slider.slick({
                nextArrow: '<div class="arrow-next">'+ theme.icon_next +'</div>',
                prevArrow: '<div class="arrow-prev">' + theme.icon_prev +'</div>',
                slidesToShow: items_xxl,
                slidesToScroll: slider.data("oneslider") ? slider.data("oneslider") : items_xxl,
                rows: slider.data("row"),
                arrows: slider.data("nav"),
                dots: slider.data("dots"),
                infinite: slider.data("loop"),
                fade: slider.data("fade"),
                speed: slider.data("speed"),
                autoplay: slider.data("autoplay"),
                autoplaySpeed: slider.data("autoplaytimeout"),
                pauseOnFocus: slider.data("focus"),
                pauseOnHover: slider.data("hover"),
                centerMode: slider.data("center"),
                cssEase: slider.data("cssease"),
                swipe: slider.data("swipe"),
                centerPadding: centerpadding,
                focusOnSelect: slider.data("focusonselect"),
                rtl: rtl,
                vertical: vertical,
                verticalSwiping: vertical,
                appendDots: appenddots.length ? appenddots : slider,
                asNavFor: navfor,
                responsive: [
                    {
                        breakpoint: 1441,
                        settings: {
                            slidesToShow: items_xl,
                            slidesToScroll: slider.data("oneslider") ? 1 : items_xl,
                            vertical: vertical_xl,
                            verticalSwiping: vertical_xl,
                            centerPadding: centerpadding_xl,
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: items_lg,
                            slidesToScroll: slider.data("oneslider") ? 1 : items_lg,
                            vertical: vertical_lg,
                            verticalSwiping: vertical_lg,
                            centerpadding: centerpadding_lg,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: items_md,
                            slidesToScroll: slider.data("oneslider") ? 1 : items_md,
                            vertical: vertical_md,
                            verticalSwiping: vertical_md,
                            centerpadding: centerpadding_md,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: items_sm,
                            slidesToScroll: slider.data("oneslider") ? 1 : items_sm,
                            rows: row_mobile,
                            vertical: vertical_sm,
                            verticalSwiping: vertical_sm,
                            centerpadding: 0
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: items_xs,
                            slidesToScroll: slider.data("oneslider") ? 1 : items_xs,
                            rows: row_mobile,
                            vertical: vertical_xs,
                            verticalSwiping: vertical_xs,
                            centerpadding: 0
                        }
                    }
                ]
            });

            if (typeof assignCascadeOrder === 'function') {
                assignCascadeOrder(el[0] || slider[0]);
            }

            var currentSlide = slider.slick('slickCurrentSlide');
            if (slider.find('.slick-cloned').length == 0) {
                checkArrow(slider, currentSlide);
            }
            
            checkClasses(slider);
            function checkClasses(class_parent) {
                var total = $('.slick-list .slick-active', class_parent).length;
                $('.slick-list .slick-slide', class_parent).removeClass('firstActiveItem lastActiveItem');

                $('.slick-list .slick-active', class_parent).each(function (index) {
                    if (index === 0 && rtl === false) {
                        $(this).addClass('firstActiveItem');
                    } else if (index === 0 && rtl === true) {
                        $(this).addClass('lastActiveItem');
                    }
                    if (index === total - 1 && total > 1 && rtl === false) {
                        $(this).addClass('lastActiveItem');
                    } else if (index === total - 1 && total > 1 && rtl === true) {
                        $(this).addClass('firstActiveItem');
                    }
                });
            };
            function checkArrow(el, current) {
                var num = $(el).find('.slick-slide').length,
                    num_act = $(el).find('.slick-slide.slick-active').length,
                    prev = $(el).parents('#shopify-section-' + sectionId).find('.nav-prev'),
                    next = $(el).parents('#shopify-section-' + sectionId).find('.nav-next');
                if (num - num_act == 0) {
                    prev.css('visibility', 'hidden');
                    next.css('visibility', 'hidden');
                } else {
                    prev.css('visibility', 'visible');
                    next.css('visibility', 'visible');
                }
                if(current == 0) {
                    prev.addClass('disabled');
                } else {
                    prev.removeClass('disabled');
                }
                if (num - num_act <= current) {
                    next.addClass('disabled');
                } else {
                    next.removeClass('disabled');
                }
            };
            $('.nav-prev', '#shopify-section-' + sectionId).click(function(){
                slider.slick('slickPrev');
            });
            $('.nav-next', '#shopify-section-' + sectionId).click(function(){
                slider.slick('slickNext');
            })
            $('.nov-slick-dot', '#shopify-section-' + sectionId).on('click', function(event) {
                if (isSliding) return;
                isSliding = true;
                $('.nov-slick-dot', '#shopify-section-' + sectionId).removeClass('current');
                $(this).addClass('current');
                
                var goToPageIndex = $(this).data('index');
                
                var slickOptions = slider.slick('slickGetOption', 'responsive');
                var slidesToShow = slider.slick('slickGetOption', 'slidesToShow');
                
                if (slickOptions && slickOptions.length > 0) {
                    for (var i = 0; i < slickOptions.length; i++) {
                        if (window.innerWidth <= slickOptions[i].breakpoint && slickOptions[i].settings.slidesToShow) {
                            slidesToShow = slickOptions[i].settings.slidesToShow;
                        }
                    }
                }
                                
                var goToSlideIndex = goToPageIndex * slidesToShow;
                
                slider.slick('slickGoTo', goToSlideIndex);
                setTimeout(function() {
                    isSliding = false;
                }, 100); 
            });

            slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                isSliding = true;
                if (isSliding) {
                    slider.addClass('sliding');
                }

                var slickOptions = slider.slick('slickGetOption', 'responsive');
                var slidesToShow = slider.slick('slickGetOption', 'slidesToShow');
                                
                if (slickOptions && slickOptions.length > 0) {
                    for (var i = 0; i < slickOptions.length; i++) {
                        if (window.innerWidth <= slickOptions[i].breakpoint && slickOptions[i].settings.slidesToShow) {
                            slidesToShow = slickOptions[i].settings.slidesToShow;
                        }
                    }
                }

                var nextPageIndex = Math.floor(nextSlide / slidesToShow);

                if ($('#shopify-section-' + sectionId).find('.nov-slick-dot').length > 0) {
                    $('#shopify-section-' + sectionId).find('.nov-slick-dot').removeClass('current');
                    $('#shopify-section-' + sectionId).find('.nov-slick-dot[data-index='+ nextPageIndex +']').addClass('current');
                }
            });

            slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
                isSliding = false;
                slider.removeClass('sliding');
                checkClasses(slider);
                if (slider.data("loop") == false) {
                    checkArrow(slider, currentSlide);
                }
            });
        });
    }
    return Nov_Slickcarousel;
})();
theme.Nov_SliderShow = (function() {
    function Nov_SliderShow(container) {
        var $container = (this.$container = $(container));
        var sectionId = $container.attr('data-section-id');
        var slideWrapper = (this.slideWrapper = '#shopify-section-' + sectionId + ' .main-slider');
        
        if($('html').hasClass('lang-rtl'))
            var rtl = true;
        else
            var rtl = false;

        var autoplay = $(slideWrapper).data('autoplay'),
            speed = $(slideWrapper).data('speed'),
            arrows = $(slideWrapper).data('arrows'),
            dots = $(slideWrapper).data('dots'),
            loadingBar = $(slideWrapper).data('loading-bar'),
            zoom = $(slideWrapper).data('zoom'),
            isSliding = false;
        $(function() {
            $(slideWrapper).on("init", function(slick) {
                slick = $(slick.currentTarget);
                if (autoplay == true && typeof loadingBar != "undefined") {
                    $(slideWrapper).find('.slick-current').addClass('loading-bar');
                }
                $(slideWrapper).find('.slick-current video').trigger('play');
                $(slideWrapper).find(".slick-current .slide-image").addClass("first-zoomin");
                $(".slick-current .caption-animate", slideWrapper).each(function() {
                    var caption = $(this).data("animate");
                    $(this).addClass(caption);
                });
                if ($('#shopify-section-' + sectionId + ' .direction-dots').length) {
                    $('#shopify-section-' + sectionId + ' .direction-dots').addClass('act');
                }
            });
            $(slideWrapper).on("beforeChange", function(event, slick, currentSlide, nextSlide) {
                $(".slick-current .caption-animate", slideWrapper).each(function() {
                    var caption = $(this).data("animate");
                    $(this).removeClass(caption);
                });
                if (zoom == true) {
                    $(slideWrapper).find(".slick-current .slide-image").removeClass("zoom_img");
                }
                if (autoplay == true && typeof loadingBar != "undefined") {
                    $(slideWrapper).find('.slick-current').removeClass('loading-bar');
                }
                $(slideWrapper).find(".slide-image").removeClass('first-zoomin');
                $(slideWrapper).find(".slide-image").removeClass('first-scale');

                $(slideWrapper).find(':focus').blur();

                if ($('#shopify-section-' + sectionId + ' .count-current').length) {
                    var slickInstance = $(slideWrapper).slick('getSlick');
                    var slidesToShow = slickInstance ? slickInstance.options.slidesToShow : 1;
                    var pageTotal = $('#shopify-section-' + sectionId + ' .count-next').data('total');
                    var page = Math.floor((nextSlide || 0) / slidesToShow) + 1;
                    var pageNext = page + 1;
                    var pageStr = page < 10 ? '0' + page : page;
                    var pageNextStr = pageNext + 1 < 10 ? '0' + pageNext : pageNext;
                    
                    $('#shopify-section-' + sectionId + ' .count-current').text(pageStr);

                    if (page + 1 > pageTotal) {
                        $('#shopify-section-' + sectionId + ' .count-next').text('01');
                    } else {
                        $('#shopify-section-' + sectionId + ' .count-next').text(pageNextStr);
                    }
                }
                if ($('#shopify-section-' + sectionId + ' .direction-dots').length) {
                    $('#shopify-section-' + sectionId + ' .direction-dots').removeClass('act');
                }
                isSliding = true;
                if (isSliding) {
                    $(slideWrapper).addClass('sliding');
                }
            });
            $(slideWrapper).on("afterChange", function(event, slick, currentSlide) {
                $(".caption-animate", '.slick-current').each(function() {
                    var caption = $(this).data("animate");
                    $(this).addClass(caption);
                });
                if (zoom == true) {
                    $(slideWrapper).find(".slick-current .slide-image").addClass("zoom_img");
                }
                if (autoplay == true && typeof loadingBar != "undefined") {
                    $(slideWrapper).find('.slick-current').addClass('loading-bar');
                }
                $(slideWrapper).find('.slick-slide').attr('inert', 'true').attr('aria-hidden', 'true');
                $(slideWrapper).find('.slick-current').removeAttr('inert').attr('aria-hidden', 'false');

                $(slideWrapper).find('video').trigger('pause');
                $(slideWrapper).find('.slick-current video').trigger('play');
                if ($('#shopify-section-' + sectionId + ' .direction-dots').length) {
                    $('#shopify-section-' + sectionId + ' .direction-dots').addClass('act');
                }
                $('.nov-slick-dot', '#shopify-section-' + sectionId).removeClass('current');
                $('.nov-slick-dot[data-index='+ currentSlide +']', '#shopify-section-' + sectionId).addClass('current');
                isSliding = false;
                $(slideWrapper).removeClass('sliding');
                slick = $(slick.$slider);
            });
            $(slideWrapper).slick({
                nextArrow: '<div class="arrow-next"></div>',
                prevArrow: '<div class="arrow-prev"></div>',
                autoplay: autoplay,
                autoplaySpeed: speed,
                lazyLoad: "progressive",
                pauseOnHover: false,
                pauseOnFocus: false,
                speed: 600,
                fade: true,
                arrows: arrows,
                dots: dots,
                cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
                rtl: rtl,
                appendDots: $('#shopify-section-' + sectionId + ' .append-dots').length ? $('#shopify-section-' + sectionId + ' .append-dots') : slideWrapper
            });
            $('.nav-prev, .count-current', '#shopify-section-' + sectionId).click(function(){
               $(slideWrapper).slick('slickPrev');
            });
            $('.nav-next, .count-next', '#shopify-section-' + sectionId).click(function(){
               $(slideWrapper).slick('slickNext');
            })

            $('.nov-slick-dot', '#shopify-section-' + sectionId).on('click', function(event) {
                $('.nov-slick-dot', '#shopify-section-' + sectionId).removeClass('current');
                $(this).addClass('current');
                var goToSingleSlide = $(this).data('index');
                $(slideWrapper).slick('slickGoTo', goToSingleSlide);
            });
        });
    }
    return Nov_SliderShow;
})();
theme.Nov_SlideCustom = (function () {
    if (!window.CustomSlideshow) {
        window.CustomSlideshow = class CustomSlideshow {
            constructor(wrapper) {
                this.wrapper = wrapper;
                this.slides = Array.from(wrapper.querySelectorAll('.sp-item'));
                if (!this.slides.length) return;
                
                this.currentIndex = 0;
                this.autoplay = wrapper.dataset.autoplay === 'true';
                this.speed = parseInt(wrapper.dataset.speed || 5000);
                this.timer = null;
                
                this.prevBtn = wrapper.querySelector('.arrow-prev');
                this.nextBtn = wrapper.querySelector('.arrow-next');
                this.dotsContainer = wrapper.querySelector('.custom-slider-dots');
                
                this.init();
            }

            init() {
                if (this.slides[0]) {
                    this.slides[0].classList.add('first-initial-load', 'active');
                    setTimeout(() => {
                        if (this.slides[0]) this.slides[0].classList.remove('first-initial-load');
                    }, 1000);
                }

                if (this.dotsContainer && this.slides.length > 1) {
                    this.dotsContainer.innerHTML = '';
                    this.dots = this.slides.map((_, i) => {
                        const dot = document.createElement('button');
                        dot.type = 'button';
                        dot.className = 'custom-dot-item';
                        dot.setAttribute('aria-label', `Slide ${i + 1}`);
                        dot.addEventListener('click', () => this.goTo(i));
                        this.dotsContainer.appendChild(dot);
                        return dot;
                    });
                }

                this.goTo(0);

                if (this.prevBtn) {
                    this.prevBtn.addEventListener('click', () => this.prev());
                }
                if (this.nextBtn) {
                    this.nextBtn.addEventListener('click', () => this.next());
                }

                if (this.autoplay) {
                    this.startAutoplay();
                    this.wrapper.addEventListener('mouseenter', () => {
                        this.stopAutoplay();
                        this.wrapper.classList.add('is-paused');
                    });
                    this.wrapper.addEventListener('mouseleave', () => {
                        this.wrapper.classList.remove('is-paused');
                        this.startAutoplay();
                    });
                }
            }

            goTo(index) {
                if (this.currentIndex !== index) {
                    setTimeout(() => {
                        this.slides.forEach(slide => slide.classList.remove('first-initial-load'));
                    }, 1000);
                }
                this.slides.forEach((slide, i) => {
                    if (i === index) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });

                if (this.dots) {
                    this.dots.forEach((dot, i) => {
                        dot.classList.remove('active', 'is-autoplay');
                        dot.style.removeProperty('--speed');
                        if (i === index) {
                            void dot.offsetWidth;
                            dot.classList.add('active');
                            if (this.autoplay) {
                                dot.style.setProperty('--speed', `${this.speed}ms`);
                                dot.classList.add('is-autoplay');
                            }
                        }
                    });
                }

                this.currentIndex = index;
            }

            next() {
                const nextIndex = (this.currentIndex + 1) % this.slides.length;
                this.goTo(nextIndex);
            }

            prev() {
                const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
                this.goTo(prevIndex);
            }

            startAutoplay() {
                this.stopAutoplay();
                this.timer = setInterval(() => this.next(), this.speed);
            }

            stopAutoplay() {
                if (this.timer) clearInterval(this.timer);
            }
        };
    }

    function initCustomSlideshows(container) {
        var scope = container ? (container instanceof HTMLElement ? container : (container[0] || document)) : document;
        var wrappers = scope.querySelectorAll ? scope.querySelectorAll('[data-custom-slideshow]') : document.querySelectorAll('[data-custom-slideshow]');
        wrappers.forEach(function(wrapper) {
            if (!wrapper._customSlideshowInstance) {
                wrapper._customSlideshowInstance = new window.CustomSlideshow(wrapper);
            }
        });
    }

    function Nov_SlideCustom(container) {
        initCustomSlideshows(container);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { initCustomSlideshows(); });
    } else {
        initCustomSlideshows();
    }
    document.addEventListener('shopify:section:load', function(e) {
        initCustomSlideshows(e.target);
    });

    return Nov_SlideCustom;
})();
theme.Nov_Swipercarousel = (function () {
    function Nov_Swipercarousel(container) {
        var $container = $(container);
        var sectionId = $container.attr("data-section-id");
        var nov_slider = "#shopify-section-" + sectionId + " .nov-swiper-carousel";
        var items_xxl = $(nov_slider).data("items_xxl") || 4;
        var items_xl = $(nov_slider).data("items_xl") || 4;
        var items_lg = $(nov_slider).data("items_lg") || 3;
        var items_md = $(nov_slider).data("items_md") || 3;
        var items_sm = $(nov_slider).data("items_sm") || 2;
        var items_xs = $(nov_slider).data("items_xs") || 2;
        var row_number = $(nov_slider).data("row") || 1;
        var row_mobile = $(nov_slider).data("row_mobile") || 1;
        var loop = $(nov_slider).data("loop") || false;
        var spacing = $(nov_slider).data("spacing");
        var spacing_mobile = $(nov_slider).data("spacing_mobile");
        var nextButton = "#shopify-section-" + sectionId + " .nav-next";
        var prevButton = "#shopify-section-" + sectionId + " .nav-prev";
        var pagination = "#shopify-section-" + sectionId + " .swiper-pagination";
        var scrollbar = $container.find(".nov-swiper-carousel .swiper-scrollbar")[0];
        var effect = $(nov_slider).data("effect") || "slide";
        var centeredSlides = $(nov_slider).data("centeredSlides") || false;

        var gridConfigDesktop = row_number > 1 ? { rows: row_number, fill: "row" } : 1;
        var gridConfigMobile = row_mobile > 1 ? { rows: row_mobile, fill: "row" } : 1;

        var watchSlidesProgress = effect !== "fade";

        var swiper = new Swiper(nov_slider, {
            slidesPerView: items_xxl,
            slidesPerGroup: 1,
            spaceBetween: spacing,
            watchSlidesProgress: watchSlidesProgress,
            centeredSlides: centeredSlides,
            loop: loop,
            navigation: {
                nextEl: nextButton,
                prevEl: prevButton,
            },
            pagination: {
                el: pagination,
                type: "bullets",
                clickable: true,
            },
            scrollbar: {
                el: scrollbar,
                draggable: true,
            },
            grabCursor: true,
            effect: effect,
            fadeEffect: {
                crossFade: true,
            },
            grid: gridConfigDesktop,
            breakpoints: {
                1441: {
                    slidesPerView: items_xxl,
                    slidesPerGroup: 1,
                    spaceBetween: spacing,
                    grid: gridConfigDesktop,
                },
                1200: {
                    slidesPerView: items_xl,
                    slidesPerGroup: 1,
                    spaceBetween: spacing,
                    grid: gridConfigDesktop,
                },
                992: {
                    slidesPerView: items_lg,
                    slidesPerGroup: 1,
                    spaceBetween: spacing,
                    grid: gridConfigDesktop,
                },
                768: {
                    slidesPerView: items_md,
                    slidesPerGroup: 1,
                    spaceBetween: spacing,
                    grid: gridConfigDesktop,
                },
                576: {
                    slidesPerView: items_sm,
                    slidesPerGroup: 1,
                    spaceBetween: spacing_mobile,
                    grid: gridConfigMobile,
                },
                320: {
                    slidesPerView: items_xs,
                    slidesPerGroup: 1,
                    spaceBetween: spacing_mobile,
                    grid: gridConfigMobile,
                },
                100: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 10,
                    grid: gridConfigMobile,
                }
            },
            simulateTouch: true,
            touchEventsTarget: 'container',
            on: {
                init: function () {
                    assignCascadeOrder(this.el.closest('.container-inner') || this.el.parentElement);
                }
            }
        });
        var isNavigating = false;
        function handleNavigationClick(event) {
            if (isNavigating) return;
            isNavigating = true;
            nextBtn.style.pointerEvents = "none";
            prevBtn.style.pointerEvents = "none";
            setTimeout(() => {
                isNavigating = false;
                nextBtn.style.pointerEvents = "auto";
                prevBtn.style.pointerEvents = "auto";
            }, 400);
        }
        var nextBtn = document.querySelector(nextButton);
        var prevBtn = document.querySelector(prevButton);
        if (nextBtn) nextBtn.addEventListener("click", handleNavigationClick);
        if (prevBtn) prevBtn.addEventListener("click", handleNavigationClick);
    }
    return Nov_Swipercarousel;
})();
$(document).ready(function() {
    var sections = new theme.Sections();
    sections.register('slideshow-section', theme.Nov_SliderShow);
    sections.register("nov-swiper", theme.Nov_Swipercarousel);
    theme.Nov_Slickcarousel();
    theme.Nov_SlideCustom();
});
theme.init = function() {
    $('a[href="#"]').on('click', function(evt) {
        evt.preventDefault();
    });
};
$(theme.init);