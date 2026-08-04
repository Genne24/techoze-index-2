(function ($) {
var body                = $('body'),
    show_wishlist = theme.show_wishlist,
    show_rating   = theme.show_rating,
    theme_cart_add_error = theme.strings.add_error,
    theme_cart_max_quantity = theme.strings.max_quantity_error;

    var wishListsArr = localStorage.getItem('wishListsArr') ? JSON.parse(localStorage.getItem('wishListsArr')) : [];
    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
    if (wishListsArr.length) {
        wishListsArr = JSON.parse(localStorage.getItem('wishListsArr'));
    };

    $(document).ready(function () {
        $(document).on('ajaxStart', function() {
            nov.isAjaxLoading = !0
        });

        $(document).on('ajaxStop', function() {
            nov.isAjaxLoading = !1
        });
        nov.init();
        $('#popup-subscribe i.zmdi-close').on('click', function() {
            $(this).parents('#popup-subscribe').modal('hide');
        })
    });
  
    var nov = {
        isAjaxLoading: !1,
        init: function () {
            window.nov = this; 
            this.closeModal();

            this.initNovWishListIcons();
            this.doAddOrRemoveWishlistProduct();
            this.doAddOrRemoveWishlist();

            if($('body').hasClass('template-page') && $('.wishlist-page').length) {
                this.initNovWishListsPage();
            };
            this.ajaxProductAddToCart();
            this.ajaxChangeFromCart();
            this.initMiniCart();
            
            this.ajaxRemoveFromCart();
            this.changeQuantityPageCart();
            this.initCollapseSidebarBlock();
            this.changeQuantityMiniCart();
            this.initproductItemColorSwatch();
            this.productItemSwatch();
            this.togglePopupAddToCart();
            this.addAllToCart();
            if(body.hasClass('template-collection')) {
                this.initCollectionPageLoadmore();
            }
            if ($(window).width() > 767) {
                this.initQuickView();
            }

            let hasLoaded = false;
            const lazyLoadProductTabs = (elements, callback) => {
                const observerCallback = (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !hasLoaded) {
                            this.novProductTabs();
                            hasLoaded = true;
                            observer.disconnect();
                        }
                    });
                };

                const observer = new IntersectionObserver(observerCallback, {
                    rootMargin: '50px 0px',
                });

                elements.forEach(element => {
                    observer.observe(element);
                });
            };
            const el = document.querySelectorAll('[data-product-tabs]');
            lazyLoadProductTabs(el);
        },
        rerenderReviews: function() {
          var trigger = function() {
            if (typeof window.avadaAirReviewRerender === 'function') {
              window.avadaAirReviewRerender();
            }
            if (window.SPR && typeof window.SPR.loadBadges === 'function') {
              window.SPR.loadBadges();
            }
            if (window.JDGM && typeof window.JDGM.reloadRatingBadges === 'function') {
              window.JDGM.reloadRatingBadges();
            }
            if (window.StampedPlugins && typeof window.StampedPlugins.reloadBadges === 'function') {
              window.StampedPlugins.reloadBadges();
            }
            if (window.Loox && typeof window.Loox.init === 'function') {
              window.Loox.init();
            }
            if (window.yotpo && typeof window.yotpo.refreshWidgets === 'function') {
              window.yotpo.refreshWidgets();
            }
            if (window.Ryviu && typeof window.Ryviu.init === 'function') {
              window.Ryviu.init();
            }
            if (window.okendo && typeof window.okendo.init === 'function') {
              window.okendo.init();
            }
            document.dispatchEvent(new CustomEvent('theme:loading:end'));
            document.dispatchEvent(new CustomEvent('product:rerender'));
          };
          trigger();
          setTimeout(trigger, 100);
          setTimeout(trigger, 300);
          setTimeout(trigger, 600);
        },
        initCollectionPageLoadmore: function () {
          var scroll__infitiny = $('.scroll__infitiny');
          var infiniteScrolling_url = '.scroll__infitiny a';
          if (scroll__infitiny.length) {
            body.off('click.initCollectionPageLoadmore', infiniteScrolling_url).on('click.initCollectionPageLoadmore', infiniteScrolling_url, function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (!$(this).hasClass('disabled')) {
                    var url = $(this).data('href');
                    nov.ajaxCollectionPageLoadmoreGetContent(url);
                };
            });

            $(window).scroll(function () {
              if (nov.isAjaxLoading) return;
              var collectionContent = $('.collection-filter__content');
              if (!collectionContent.length) collectionContent = $('.collection-template');
              if (!collectionContent.length) return;
              var collectionTop = collectionContent.offset().top;
              var collectionHeight = collectionContent.outerHeight();
              var posTop = collectionTop + collectionHeight - $(window).height();
              if ($(this).scrollTop() > posTop && $(this).scrollTop() < (posTop + 200)) {
                  var button = $(infiniteScrolling_url);
                  if (button.length && !button.hasClass('disabled')) {
                      var url = button.data('href');
                      nov.ajaxCollectionPageLoadmoreGetContent(url);
                  };
              };
          });
          }
        },
        ajaxCollectionPageLoadmoreGetContent: function (url) {
          if (nov.isAjaxLoading) return;
          $.ajax({
            type: "GET",
            url: url,
            beforeSend: function () {
              $('.scroll__infitiny').removeClass('loading').addClass('loading');
            },
            success: function (data) {
              nov.ajaxCollectionPageLoadmoreMapData(data);
            },
            complete: function () {
              $('.scroll__infitiny').removeClass('loading');
            }
          });
        },
        ajaxCollectionPageLoadmoreMapData: function (data) {
          var collectionTemplate = $('.collection-template');
          var currentProductCollection = collectionTemplate.find('.product-collection');
          var currentProductCount = collectionTemplate.find('.paging');
          var newCollectionTemplate = $(data).find('.collection-template');
          var newProductCollection = newCollectionTemplate.find('.product-collection');
          var newProductCount = newCollectionTemplate.find('.paging');
          var newProductItem = newProductCollection.children('.product--item');
          currentProductCount.replaceWith(newProductCount);
          if (newProductCollection.length) {
            currentProductCollection.append(newProductItem);

            var n = collectionTemplate.find('.product--item').length;
            var m = $('.pagination__bar').data('max');
            $('.pagination__count .count').text(n);
            $('.pagination__bar .progress').css('width',  n/m*100 + '%');
            nov.rerenderReviews();
          }
        },
        togglePopupAddToCart: function() {
            $('.selector-wrapper-1').each(function(){
              if ($(this).hasClass('opt-color') && $(this).hasClass('hide')) {
                $(this).closest('.item-product__popup--variant').find('.btn-close-quick-add').hide();
              }
            })
            $(document).on('click', '.btn-quick-add', function(){
                $(this).parents('.item-product').addClass('act');
                $('.item-product__popup--variant').removeClass('act');
                $(this).parents('.item-product').find('.item-product__popup--variant').addClass('act');
                document.querySelectorAll('.btn-alternate').forEach((btn) => {
                    btn.addEventListener('mouseenter', () => {
                        btn.classList.remove('is-leave');
                        btn.classList.add('is-hover');
                    });
                    btn.addEventListener('mouseleave', () => {
                        btn.classList.remove('is-hover');
                        btn.classList.add('is-leave');
                    });
                });
            });
            $(document).on('click', '.btn-close-quick-add', function(){
                $(this).parent().removeClass('act');
                $(this).parents('.item-product').removeClass('act');
                $(this).parents('.item-product').find('.item-product__popup--variant').removeClass('act');
            });
            /*$(document).on("click", function(event){
                if(!$(event.target).closest(".inner-top").length){
                    $(".item-product__popup--variant").removeClass('act');
                }
            });*/
        },
        initCollapseSidebarBlock: function() {
            $(document).on("click", ".facets__label--title", t => {
                var a = $(t.currentTarget),
                    o = a.parents('.js-filter').find(".facets__content");
                a.parent().hasClass("act") ? (a.parent().removeClass("act"), a.parents('.js-filter').removeClass("act"), 
                o.slideUp()) : (a.parent().addClass("act"), a.parents('.js-filter').addClass("act"), o.slideDown())
            })
        },
        closeModal: function() {
            $('.close-modal, .overlay').click(function() {
                $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
            });
        },

        novProductTabs: function () {
            var productTabs = $('[data-product-tabs]');
            productTabs.each(function () {
                var self = $(this),
                    listTabs = self.find('.list-product-tabs'),
                    tabLink = listTabs.find('[data-product-tabtop]'),
                    tabContent = self.find('[data-product-TabContent]'),
                    linkActive = self.find('.list-product-tabs .tab-links.active'),
                    activeTab = self.find('.product_tab_content .tab-content.active');

                nov.doAjaxNovProductTabs(linkActive.data('href'), activeTab.find('.products-grid'), tabLink);
                tabLink.off('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).closest('.nov_ud_toggle').find('.nov_ud_group').removeClass('act');
                    $(this).closest('.nov_ud_toggle').find('.nov_ud_dropdown').slideUp();

                    if ($(this).hasClass('active')) {
                        return;
                    }
                    if (!$(this).hasClass('active')) {
                        var curTab = $(this),
                            curTabContent = $(curTab.data('target'));
                        tabLink.removeClass('active');
                        tabContent.removeClass('active');

                        if (!curTabContent.find('.collection-carousel').hasClass('slick-initialized')) {
                            nov.doAjaxNovProductTabs(curTab.data('href'), curTabContent.find('.products-grid'), tabLink);
                        }

                        curTab.addClass('active');
                        curTabContent.addClass('active');
                        $(this).closest('.nav-mobile').find('.nav-mobile__title').text($(this).text());
                    }
                    const currentTabId = curTabContent.data('tab-id');
                    const $appendDots = curTabContent.closest('[data-product-tabs]').find('.append-dots .slick-dots');
                    $appendDots.hide();
                    $appendDots.filter('[data-tab-id="' + currentTabId + '"]').show();
                });
            });
        },
        doAjaxNovProductTabs: function(handle, curTabContent, tabLink) {
            const localePrefix = Shopify.locale && Shopify.locale !== 'en' ? `/${Shopify.locale}` : '';
            const ajaxUrl = `${localePrefix}${handle}?sections=nov-ajax_collection_tab`.replace(/([^:]\/)\/+/g, "$1");
            $.ajax({
                type: "GET",
                url: ajaxUrl,
                cache: false,
                beforeSend : function (){
                    tabLink.css({'pointer-events': 'none', 'opacity': '0.6'});
                },
                success: function (data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    var sectionHTML = $(data['nov-ajax_collection_tab']).find('.grid-item').html();
                    curTabContent.html(sectionHTML);

                    var limit = tabLink.data('limit') - 1;
                    curTabContent.find('.block:gt('+ limit +')').remove();

                    if (curTabContent.hasClass('collection-carousel')) {
                        if (!curTabContent.hasClass('slick-initialized')) {
                            nov.initNovProductTabsSlider(curTabContent.parent());
                        };
                    }
                    if (show_wishlist == true) {
                        nov.initNovWishListIcons();
                    }
                    if (show_rating == true) {
                        if (typeof window.avadaAirReviewRerender === 'function' && $('.AirReviews-Widget').length > 0) {
                            window.avadaAirReviewRerender();
                        }
                    }
                    document.querySelectorAll('.btn-alternate').forEach((btn) => {
                        btn.addEventListener('mouseenter', () => {
                            btn.classList.remove('is-leave');
                            btn.classList.add('is-hover');
                        });
                        btn.addEventListener('mouseleave', () => {
                            btn.classList.remove('is-hover');
                            btn.classList.add('is-leave');
                        });
                    });
                },
                complete: function() {
                    tabLink.css({'pointer-events': 'auto', 'opacity': '1'});
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
                        var dayString = showDays ? '<div class="item-time"><span class="data-number">%D</span><span class="name-time">'+ theme.strings.days +'</span></div>' : '';
                        var countdown_format = dayString
                                           + '<div class="item-time"><span class="data-number">%H</span><span class="name-time">'+ theme.strings.hours +'</span></div>'
                                           + '<div class="item-time"><span class="data-number">%M</span><span class="name-time">'+ theme.strings.minutes +'</span></div>'
                                           + '<div class="item-time"><span class="data-number">%S</span><span class="name-time">'+ theme.strings.seconds +'</span></div>';
                        $countdown.countdown(NewfinalDate, function(event) {
                            $countdown.html(event.strftime(countdown_format));
                        }).on('finish.countdown', function() {
                            if (restartCountdown) {
                                startCountdown($countdown, showDays, restartCountdown);
                            }
                        });
                    }
                
                    $('.countdownfree').each(function() {
                        var showDays = $(this).data('show-days') || false;
                        var restartCountdown = $(this).data('restart') || false;
                        startCountdown($(this), showDays, restartCountdown);
                    });
                }
            });
        },
        initNovProductTabsSlider: function (tabslider) {
            tabslider.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    t = !!$("html").hasClass("lang-rtl"),
                    nav = productGrid.data("nav");
                if (productGrid.not('.slick-initialized')) {
                    const tabId = self.closest('.tab-content').data('tab-id');
                    var isSliding = false;
                    productGrid.on("init", function(slick) {
                        const $dots = productGrid.closest('[data-product-tabs]').find('.append-dots .slick-dots').last();
                        $dots.attr('data-tab-id', tabId);
                    })
                    productGrid.slick({
                        nextArrow: '<div class="arrow-next">' + theme.icon_next + '</div>',
                        prevArrow: '<div class="arrow-prev">' + theme.icon_prev + '</div>',
                        rtl: t,
                        slidesToShow: productGrid.data("items_xxl"),
                        slidesToScroll: productGrid.data("items_xxl"),
                        rows: productGrid.data("row"),
                        row_mobile: productGrid.data("row_mobile"),
                        arrows: nav,
                        dots: productGrid.data("dots"),
                        infinite: productGrid.data("loop"),
                        appendDots: productGrid.closest('[data-product-tabs]').find('.append-dots'),
                        responsive: [
                            { 
                                breakpoint: 1441, 
                                settings: { 
                                    slidesToShow: productGrid.data("items_xl"),
                                    slidesToScroll: productGrid.data("items_xl"),
                                }
                            },
                            { 
                                breakpoint: 1200, 
                                settings: { 
                                    slidesToShow: productGrid.data("items_lg"), 
                                    slidesToScroll: productGrid.data("items_lg"),
                                } 
                            },
                            { 
                                breakpoint: 992, 
                                settings: { 
                                    slidesToShow: productGrid.data("items_md"), 
                                    slidesToScroll: productGrid.data("items_md"),
                                } 
                            },
                            { 
                                breakpoint: 768, 
                                settings: { 
                                    slidesToShow: productGrid.data("items_sm"), 
                                    slidesToScroll: productGrid.data("items_sm"),
                                    arrows: false,
                                } 
                            },
                            { 
                                breakpoint: 480, 
                                settings: { 
                                    slidesToShow: productGrid.data("items_xs"), 
                                    slidesToScroll: productGrid.data("items_xs"),
                                    arrows: !1,
                                    rows: productGrid.data("row_mobile")
                                } 
                            },
                        ]
                    });

                    $('[data-product-tabs]').find('.nav-prev').click(function(){
                       $(this).parents('[data-product-tabs]').find('.tab-content.active').find(productGrid).slick('slickPrev');
                    });
                    $('[data-product-tabs]').find('.nav-next').click(function(){
                       $(this).parents('[data-product-tabs]').find('.tab-content.active').find(productGrid).slick('slickNext');
                    })
                    productGrid.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                        isSliding = true;
                        if (isSliding) {
                            productGrid.addClass('sliding');
                        }
                    });
                    productGrid.on('afterChange', function(event, slick, currentSlide, nextSlide){
                        isSliding = false;
                        productGrid.removeClass('sliding');
                    });
                }
            });
        },
        productItemSwatch: function() {
            $(document).on('change', '.selector-wrapper :radio', function(e){ 
                var _self = $(this);
                var product_item = _self.parents('.item-product');
                var item_swatch = _self.parents('.product__popup-swatch');
                var product_info = product_item.data('json-product');
                var variants = product_info.variants;
                var option_position = product_item.find('.opt-color').data('opt-position');
                var option_index = _self.closest('[data-option-index]').data('option-index');
                var el_swatch = item_swatch.find('.swatch-element');
                var variant_value = _self.val();
                var selected_variant;
                var productInput = item_swatch.find('[name=id]');
                var selected_swatch_opt1 = item_swatch.find('.selector-wrapper-1').find('input:checked').val();
                var selected_swatch_opt2 = item_swatch.find('.selector-wrapper-2').find('input:checked').val();
                var selected_swatch_opt3 = item_swatch.find('.selector-wrapper-3').find('input:checked').val();
                el_swatch.removeClass('soldout');
                el_swatch.find(':radio').prop('disabled',false);
                switch (option_index){
                  case 0:
                      var available_variants = variants.find(function(variant){
                          if (option_position == 1) {
                              return variant.option2 == variant_value && variant.option1 == selected_swatch_opt2;
                          } else {
                            if (option_position == 2) {
                              return variant.option3 == variant_value && variant.option1 == selected_swatch_opt2;
                            } else {
                              return variant.option1 == variant_value && variant.option2 == selected_swatch_opt2;
                            }
                          }
                      })

                      if(available_variants != undefined){
                          selected_variant =  available_variants;
                      }else{
                          var alt_available_variants = variants.find(function(variant){
                              if (option_position == 1) {
                                  return variant.option2 == variant_value;
                              } else {
                                  if (option_position == 2) {
                                    return variant.option3 == variant_value;
                                  } else {
                                    return variant.option1 == variant_value;
                                  }
                              }
                          })
                          selected_variant =  alt_available_variants;
                      };
                      break;
                  case 1:
                      var available_variants = variants.find(function(variant){
                          if (option_position == 1) {
                              return variant.option2 == selected_swatch_opt1 && variant.option1 == variant_value && variant.option3 == selected_swatch_opt3;
                          } else {
                              if (option_position == 2) {
                                return variant.option3 == selected_swatch_opt1 && variant.option1 == variant_value && variant.option2 == selected_swatch_opt3;
                              } else {
                                return variant.option1 == selected_swatch_opt1 && variant.option2 == variant_value && variant.option3 == selected_swatch_opt3;
                              }
                          }
                          
                      })
                      if(available_variants != undefined){
                          selected_variant =  available_variants;
                      } else {
                          var alt_available_variants = variants.find(function(variant){
                              if (option_position == 1) {
                              return variant.option2 == selected_swatch_opt1 && variant.option1 == variant_value;
                          } else {
                              if (option_position == 2) {
                                return variant.option3 == selected_swatch_opt1 && variant.option1 == variant_value;
                              } else {
                                return variant.option1 == selected_swatch_opt1 && variant.option2 == variant_value;
                              }
                          }
                          })
                          selected_variant =  alt_available_variants;
                      };
                      break;
                  case 2:
                      var available_variants = variants.find(function(variant){
                          if (option_position == 1) {
                              return variant.option2 == selected_swatch_opt1 && variant.option1 == selected_swatch_opt2 && variant.option3 == variant_value;
                          } else {
                              if (option_position == 2) {
                                return variant.option3 == selected_swatch_opt1 && variant.option1 == selected_swatch_opt2 && variant.option2 == variant_value;
                              } else {
                                return variant.option1 == selected_swatch_opt1 && variant.option2 == selected_swatch_opt2 && variant.option3 == variant_value;
                              }
                              
                          }
                      })
                      if(available_variants != undefined){
                         selected_variant =  available_variants;
                      }
                      break;
                }
                if (selected_variant == undefined) return;
                productInput.val(selected_variant.id);
                if (selected_variant.compare_at_price > selected_variant.price) {
                    product_item.find('[data-compare-price-grid]').html(Shopify.formatMoney(selected_variant.compare_at_price, theme.moneyFormat));
                } else {
                    product_item.find('[data-compare-price-grid]').html('');
                }
                product_item.find('[data-price-grid]').html(Shopify.formatMoney(selected_variant.price, theme.moneyFormat));
                _self.parents('.selector-wrapper').find('.form-label span').text(variant_value);
                nov.checkStatusSwatch(product_item, item_swatch);

                var current_variant_id = item_swatch.find('.current_variant_id').attr('value');
                var inventory_policy = item_swatch.find('.product-form__variants [value="'+current_variant_id+'"]').data('inventory_policy');
                var inventory_management = item_swatch.find('.product-form__variants [value="'+current_variant_id+'"]').data('inventory_management');
                if(inventory_policy == 'continue' && inventory_management == 'shopify') {
                  item_swatch.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.preorder);
                } else {
                  item_swatch.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.add_to_cart);
                }
            });
            $(document).on('change', '.item-product__popup--variant select.single-option-selector', function(){
                var _self = $(this);
                var product_item = _self.parents('.item-product');
                var item_swatch = _self.parents('.product__popup-swatch');
                var product_info = product_item.data('json-product');
                var variants = product_info.variants;
                var option_index = _self.data('option');
                var pval = _self.val();
                var selected_variant;
                var productInput = item_swatch.find('[name=id]');
                var selected_swatch_opt1 = item_swatch.find('[data-option="option1"]').val();
                var selected_swatch_opt2 = item_swatch.find('[data-option="option2"]').val();
                var selected_swatch_opt3 = item_swatch.find('[data-option="option3"]').val();

                switch (option_index){
                    case 'option1':
                        var available_variants = variants.find(function(variant){
                            return variant.option1 == pval && variant.option2 == selected_swatch_opt2 && variant.available;
                        })
                        if(available_variants != undefined){
                            selected_variant =  available_variants;
                        }else{
                            var altAvailableVariants = variants.find(function(variant){
                                return variant.option1 == pval && variant.available;
                            })
                            selected_variant =  altAvailableVariants;
                        };
                        break;
                    case 'option2':
                        var available_variants = variants.find(function(variant){
                            return variant.option1 == selected_swatch_opt1 && variant.option2 == pval && variant.available;
                        })
                        if(available_variants != undefined){
                            selected_variant =  available_variants;
                        };
                        break;
                    case 'option3':
                        var available_variants = variants.find(function(variant){
                            return variant.option1 == selected_swatch_opt1 && variant.option2 == selected_swatch_opt2 && variant.option3 == pval && variant.available;
                        })
                        if(available_variants != undefined){
                           selected_variant =  available_variants;
                        };
                        break;
                }
                if (selected_variant != undefined) {
                    productInput.val(selected_variant.id);
                }
                _self.parents('.selector-wrapper').find('.form-label span').text(pval);

                nov.checkStatusSwatch(product_item, item_swatch);
                var current_variant_id = item_swatch.find('.current_variant_id').attr('value');
                var inventory_policy = item_swatch.find('.product-form__variants [value="'+current_variant_id+'"]').data('inventory_policy');
                var inventory_management = item_swatch.find('.product-form__variants [value="'+current_variant_id+'"]').data('inventory_management');
                if(inventory_policy == 'continue' && inventory_management == 'shopify') {
                  item_swatch.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.preorder);
                } else {
                  item_swatch.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.add_to_cart);
                }
                product_item.find('[data-price-grid]').html(Shopify.formatMoney(selected_variant.price, theme.moneyFormat));
            })
            $(document).on('click', '.selector-wrapper .unavailable :radio', function(e){
                var _self = $(this);
                _self.parents('.item-product').find('[data-btn-addtocart]').attr('disabled', 'disabled');
            });
        },
        initproductItemColorSwatch: function() {
            var item_swatch_el = '.item-swatch li .label';
            body.off('click.toggleClass').on('click.toggleClass', item_swatch_el, function () {
                var self = $(this);
                var title = self.attr('data-title').replace(/^\s+|\s+$/g, '');
                var product_item = self.closest('.item');

                self.parents('.item-swatch').find('li .label').removeClass('active');
                self.addClass('active');
                var product_info = $(this).parents('.item-product').data('json-product');

                var href = product_item.find('a').attr('href');
                product_item.find('.product__label-color').find('[data-change-title]').text(title)
                if (self.data('with-one-option') != undefined) {
                    var quantity = self.data('quantity');
                    var inventory_policy = self.data('inventory_policy');
                    var inventory_management = self.data('inventory_management');
                
                    product_item.find('[name="id"]').val(self.data('with-one-option'));
                    if (quantity > 0) {
                        product_item.find('[data-btn-addtocart]').removeClass('disabled').removeAttr('disabled');
                        if (inventory_policy == 'continue' && inventory_management == 'shopify') {
                            product_item.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.preorder);
                        } else {
                            product_item.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.add_to_cart);
                        }
                    } else {
                        product_item.find('[data-btn-addtocart]').addClass('disabled').attr('disabled', 'disabled');
                        product_item.find('[data-btn-addtocart] .add-to-cart-text').text(window.inventory_text.sold_out);
                    }
                    var price = self.data('price'),
                        comparePrice = self.data('compare_at_price');
                    if (comparePrice > price) {
                        product_item.find('[data-compare-price-grid]').html(Shopify.formatMoney(comparePrice, theme.moneyFormat));
                    } else {
                        product_item.find('[data-compare-price-grid]').html('');
                    }
                    product_item.find('[data-price-grid]').html(Shopify.formatMoney(price, theme.moneyFormat));
                } else {
                    if (product_info != undefined) {
                        nov.checkStatusSwatch(self.parents('.item-product'));
                    }
                    if ($('.template-collection').length) {
                        if (self.parents('.product-collection').hasClass('products-list')) {
                            product_item.find('.product-details [data-value="' + title + '"] label').trigger('click');
                        } else {
                            product_item.find('.product__popup-swatch:eq(0)').find('[data-value="' + title + '"] label').trigger('click');
                        }
                    } else {
                        product_item.find('[data-value="' + title + '"]').find('label').trigger('click');
                    }
                }
                var new_image = self.data('img');
                if (new_image) {
                    product_item.find('.thumbnail-container .product__thumbnail, .thumbnail-container .product__thumbnail-second').attr({
                        "data-srcset": new_image,
                        "data-src": new_image,
                        "src": new_image,
                        "srcset": new_image
                    });
                    return false;
                }
                });

                body.off('click.showmore').on('click.showmore', '.item-swatch-more .show_more', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).parents('.item-swatch').toggleClass('show--more');
                ($(this).parents('.item-swatch').hasClass('show--more')) ? $(this).children().text('-') : $(this).children().text('+');
            });
        },
        checkStatusSwatch: function(product_item, item_swatch) {
            if (window.use_color_swatch) {
                
                var product_info = product_item.data('json-product');
                var variants = product_info.variants;
                var options = product_item.find('[data-option-index]');
                var opt_position = product_item.find('.opt-color').data('opt-position');
                if (item_swatch == undefined) {
                    item_swatch = product_item;
                }
                var selected_swatch_opt1 = item_swatch.find('[data-option-index="0"]').find('input:checked').val();
                var selected_swatch_opt2 = item_swatch.find('[data-option-index="1"]').find('input:checked').val();
                var selected_swatch_opt3 = item_swatch.find('[data-option-index="2"]').find('input:checked').val();

                options.each(function(){
                  var option_index = $(this).data('option-index');
                  var item_el = $(this).find('.swatch-element');
                  switch (option_index) {
                      case 0:
                      item_el.each(function(){
                          var swatch_val = $(this).data('value');
                          var opt1_soldout = variants.find(function(variant){
                              if (opt_position == 1) {
                                  return variant.option2 == swatch_val && variant.available;
                              } else {
                                  if (opt_position == 2) {
                                    return variant.option3 == swatch_val && variant.available;
                                  } else {
                                    return variant.option1 == swatch_val && variant.available;
                                  }  
                              }
                          });
                          var option_unavailable = variants.find(function(variant){
                              if (opt_position == 1) {
                                  return variant.option2 == swatch_val;
                              } else {
                                  if (opt_position == 2) {
                                    return variant.option3 == swatch_val;
                                  } else {
                                    return variant.option1 == swatch_val;
                                  }
                              }
                          });
                          if(opt1_soldout == undefined){
                              if (option_unavailable == undefined) {
                                $(this).addClass('unavailable');
                                $(this).removeClass('soldout');
                                $(this).removeClass('available');
                                $(this).find(':radio').prop('checked',false);
                                $(this).attr('data-toggle', 'modal');
                                $(this).attr('data-target', '#Form_newletter');
                              } else {
                                $(this).addClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).removeClass('available');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).attr('data-toggle', 'modal');
                                $(this).attr('data-target', '#Form_newletter');
                              }
                          } else {
                                $(this).removeClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).addClass('available');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).removeAttr('data-toggle', 'modal');
                                $(this).removeAttr('data-target', '#Form_newletter');
                          }
                      })
                      break;
                      case 1:
                      item_el.each(function(){
                          var swatch_val = $(this).data('value');
                          var opt1_soldout = variants.find(function(variant){
                              if (opt_position == 1) {
                                  return variant.option2 == selected_swatch_opt1 && variant.option1 == swatch_val && variant.available;
                              } else {
                                  if (opt_position == 2) {
                                    return variant.option3 == selected_swatch_opt1 && variant.option1 == swatch_val && variant.available;
                                  } else {
                                    return variant.option1 == selected_swatch_opt1 && variant.option2 == swatch_val && variant.available;
                                  }
                              }
                          });
                          var option_unavailable = variants.find(function(variant){
                              if (opt_position == 1) {
                                  return variant.option2 == selected_swatch_opt1 && variant.option1 == swatch_val;
                              } else {
                                  if (opt_position == 2) {
                                    return variant.option3 == selected_swatch_opt1 && variant.option1 == swatch_val;
                                  } else {
                                    return variant.option1 == selected_swatch_opt1 && variant.option2 == swatch_val;
                                  }
                              }
                          });
                          if(opt1_soldout == undefined){
                              if (option_unavailable == undefined) {
                                  $(this).addClass('unavailable');
                                  $(this).removeClass('soldout');
                                  $(this).removeClass('available');
                                  $(this).find(':radio').prop('checked',false);
                                  $(this).attr('data-toggle', 'modal');
                                  $(this).attr('data-target', '#Form_newletter');
                              } else {
                                  $(this).addClass('soldout');
                                  $(this).removeClass('unavailable');
                                  $(this).removeClass('available');
                                  $(this).find(':radio').prop('disabled',false);
                                  $(this).attr('data-toggle', 'modal');
                                  $(this).attr('data-target', '#Form_newletter');
                              }
                          } else {
                              $(this).removeClass('soldout');
                              $(this).removeClass('unavailable');
                              $(this).addClass('available');
                              $(this).find(':radio').prop('disabled',false);
                              $(this).removeAttr('data-toggle', 'modal');
                              $(this).removeAttr('data-target', '#Form_newletter');
                          }
                      })
                      break;
                      case 2:
                      item_el.each(function(){
                          var swatch_val = $(this).data('value');
                          var swatch_inventory_policy = $(this).data('inventory_policy');
                          var opt1_soldout = variants.find(function(variant){
                              if (opt_position == 1) {
                                  return variant.option2 == selected_swatch_opt1 && variant.option1 == selected_swatch_opt2 && variant.option3 == swatch_val && variant.available;
                              } else {
                                  if (opt_position == 2) {
                                    return variant.option3 == selected_swatch_opt1 && variant.option1 == selected_swatch_opt2 && variant.option2 == swatch_val && variant.available;
                                  } else {
                                    return variant.option1 == selected_swatch_opt1 && variant.option2 == selected_swatch_opt2 && variant.option3 == swatch_val && variant.available;
                                  }
                                  
                              }
                              
                          });
                          var option_unavailable = variants.find(function(variant){
                              if (opt_position == 1) {
                                  return variant.option2 == selected_swatch_opt1 && variant.option1 == selected_swatch_opt2 && variant.option3 == swatch_val;
                              } else {
                                  if (opt_position == 2) {
                                    return variant.option3 == selected_swatch_opt1 && variant.option1 == selected_swatch_opt2 && variant.option2 == swatch_val;
                                  } else {
                                    return variant.option1 == selected_swatch_opt1 && variant.option2 == selected_swatch_opt2 && variant.option3 == swatch_val;
                                  }
                                  
                              }
                          });
                          if(opt1_soldout == undefined){
                              if (option_unavailable == undefined) {
                                  $(this).addClass('unavailable');
                                  $(this).removeClass('soldout');
                                  $(this).removeClass('available');
                                  $(this).find(':radio').prop('checked',false);
                                  $(this).attr('data-toggle', 'modal');
                                  $(this).attr('data-target', '#Form_newletter');
                              } else {
                                  $(this).addClass('soldout');
                                  $(this).removeClass('unavailable');
                                  $(this).removeClass('available');
                                  $(this).find(':radio').prop('disabled',false);
                                  $(this).attr('data-toggle', 'modal');
                                  $(this).attr('data-target', '#Form_newletter');
                              }
                          } else {
                              $(this).removeClass('soldout');
                              $(this).removeClass('unavailable');
                              $(this).addClass('available');
                              $(this).find(':radio').prop('disabled',false);
                              $(this).removeAttr('data-toggle', 'modal');
                              $(this).removeAttr('data-target', '#Form_newletter');
                          }
                      })
                      break;
                  }
                });
                if (item_swatch.find('.swatch-element.soldout').find('input:checked').length) {
                    item_swatch.find('[data-btn-addtocart]').attr('disabled', true);
                } else {
                    item_swatch.find('[data-btn-addtocart]').removeAttr('disabled');
                }
                item_swatch.find('.selector-wrapper:not(.opt-color)').each(function(){
                    if ($(this).find('.swatch-element').find('input:checked').length == 0) {
                        if ($(this).find('.swatch-element.available').length) {
                            $(this).find('.swatch-element.available').eq('0').find('label').trigger('click');
                        } else {
                            $(this).find('.swatch-element.soldout').eq('0').find('label').trigger('click');
                        }
                    }
                });
            }
            else {
                var product_info = product_item.data('json-product');
                var variants = product_info.variants;
                var options = product_item.find('.item-product__popup--variant [data-option]');
                var selected_swatch_opt1 = item_swatch.find('.item-product__popup--variant [data-option="option1"]').val();
                var selected_swatch_opt2 = item_swatch.find('.item-product__popup--variant [data-option="option2"]').val();
                var selected_swatch_opt3 = item_swatch.find('.item-product__popup--variant [data-option="option3"]').val();
                options.each(function(){
                    var option_index = $(this).data('option-index');
                    var swatch_el = $(this).find('option');
                    switch (option_index) {
                      case 0:
                      swatch_el.each(function(){
                        var swatch_val = $(this).val();
                        var opt1_soldout = variants.find(function(variant){
                          return variant.option1 == swatch_val && variant.available;
                        })
                        if(opt1_soldout == undefined){
                            var option_unavailable = variants.find(function(variant){
                                return variant.option1 == swatch_val;
                            });
                            if (option_unavailable == undefined) {
                                $(this).attr('status','unavailable');
                            } else {
                                $(this).attr('status','soldout');
                            }
                        }
                        else {
                            $(this).attr('status','available');
                        }
                      });
                      break;

                      case 1:
                      swatch_el.each(function(){
                        var swatch_val = $(this).val();
                        var opt1_soldout = variants.find(function(variant){
                          return variant.option1 == selected_swatch_opt1 && variant.option2 == swatch_val && variant.available;
                        });
                        if(opt1_soldout == undefined){
                            var option_unavailable = variants.find(function(variant){
                                return variant.option1 == selected_swatch_opt1 && variant.option2 == swatch_val;
                            });
                            if (option_unavailable == undefined) {
                                $(this).attr('status','unavailable');
                            } else {
                                $(this).attr('status','soldout');
                            }
                        } else {
                            $(this).attr('status','available');
                        }
                      });
                      break;

                      case 2:
                      swatch_el.each(function(){
                        var swatch_val = $(this).val();
                        var opt1_soldout = variants.find(function(variant){
                          return variant.option1 == selected_swatch_opt1 && variant.option2 == selected_swatch_opt2 && variant.option3 == swatch_val && variant.available;
                        });
                        if(opt1_soldout == undefined){
                            var option_unavailable = variants.find(function(variant){
                                return variant.option1 == selected_swatch_opt1 && variant.option2 == selected_swatch_opt2 && variant.option3 == swatch_val;
                            });
                            if (option_unavailable == undefined) {
                                $(this).attr('status','unavailable');
                            } else {
                                $(this).attr('status','soldout');
                            }
                        } else {
                            $(this).attr('status','available');
                        }
                      });
                      break;
                    }
                    if (item_swatch.find('.item-product__popup--variant .single-option-selector').find('option[status="soldout"]:selected, option[status="unavailable"]:selected').length) {
                        item_swatch.find('[data-btn-addtocart]').attr('disabled', true);
                    } else {
                        item_swatch.find('[data-btn-addtocart]').removeAttr('disabled');
                    }
                });
            }
        },
        initNovWishListsPage: function() {
            if (typeof(Storage) !== 'undefined') {               
                if (wishListsArr.length <= 0) {
                   return;
                }

                wishListsArr.forEach(function(item) {
                   nov.createNovWishListTplItem(item);             
                });
            } else {
                alert('Storage no support!');
            }
        },
        initNovWishListIcons: function() {
            if (!wishListsArr.length) {
                return;
            }
            for (var i = 0; i < wishListsArr.length; i++) {
                var icon = $('[data-product-handle="'+ wishListsArr[i] +'"]');
                icon.addClass('whislist-added');
                icon.find('.btn-tootip, .wishlist-text').text(theme.strings.remove_wishlist);
            };
            if (typeof(Storage) !== 'undefined') {
                if (wishListsArr.length <= 0) {
                    return;
                }

                setTimeout(function() {
                    wishListsArr.forEach(function(item) {
                        nov.setNovAddedForWishlistIcon(item);  
                    });
                }, 1000);
            } else {
                alert('Storage no support!');
            }
        },
        setNovAddedForWishlistIcon: function(ProductHandle) {
            var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]');
            var textadd = theme.strings.addto_wishlist;
            var textremove = theme.strings.remove_wishlist;
            idxArr = wishListsArr.indexOf(ProductHandle);
            $('.WishlistCount').text(wishListsArr.length);
            if (idxArr >= 0) {
                wishlistElm.addClass('whislist-added');
                wishlistElm.find('.btn-tootip').text(textremove);
                wishlistElm.attr('title',textremove);
            }
            else {
                wishlistElm.removeClass('whislist-added');
                wishlistElm.find('.btn-tootip').text(textadd);
                wishlistElm.attr('title',textadd);
            };
        },
          
        doAddOrRemoveWishlist: function() {   
            var iconWishLists = '.item-product [data-icon-wishlist]';
            var textadd = theme.strings.addto_wishlist;
            var textremove = theme.strings.remove_wishlist;
            
            $(document).off('click.addOrRemoveWishlist', iconWishLists).on('click.addOrRemoveWishlist', iconWishLists, function(e) {
                e.preventDefault();
                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('product-handle'),
                    idxArr = wishListsArr.indexOf(ProductHandle);

                if (!self.hasClass('whislist-added')) {
                    self.addClass('whislist-added');
                    self.find('.btn-tootip, .wishlist-text').text(textremove);
                    self.attr({'title':textremove, 'data-original-title':textremove});
                    $('.tooltip-inner').text(textremove);

                    var title = self.parents('.item-product').find('.product__title').html();
                    var image = self.parents('.item-product').find('.product__thumbnail').attr('srcset') 
                    ? self.parents('.item-product').find('.product__thumbnail').attr('srcset') 
                    : self.parents('.item-product').find('.product__thumbnail').attr('src');

                    $('.loading-modal').find('.product-title').html(title);
                    $('.loading-modal').find('.product-image').attr('srcset', image);
                    $('.loading-modal').find('.btn-wishlist').show();
                    $('.loading-modal').css({"opacity": "1", "visibility": "initial", "transform": "translateX(0)", "transition": "all 0.3s"});
                    $('.loading-modal').addClass('novload');
                    setTimeout(function() {
                        $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
                        $('.loading-modal').removeClass('novload');
                    }, 5000);

                    if ($('[data-wishlist-container]').length) {
                        nov.createNovWishListTplItem(ProductHandle);
                    };

                    wishListsArr.push(ProductHandle);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

                } else {
                    self.removeClass('whislist-added');
                    self.find('.btn-tootip, .wishlist-text').text(textadd);
                    self.attr({'title':textadd, 'data-original-title':textadd});
                    $('.tooltip-inner').text(textadd);
                    if ($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                        $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                    }

                    wishListsArr.splice(idxArr, 1);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
                };

                nov.setNovAddedForWishlistIcon(ProductHandle);
            });
        },

        doAddOrRemoveWishlistProduct: function() {
            var iconWishLists = '.product-single__wishlist a[data-icon-wishlist]';

            $(document).off('click.addOrRemoveWishlist', iconWishLists).on('click.addOrRemoveWishlist', iconWishLists, function(e) {
                e.preventDefault();

                var self = $(this),
                productId = self.data('id'),
                ProductHandle = self.data('product-handle'),
                idxArr = wishListsArr.indexOf(ProductHandle);

                if (!self.hasClass('whislist-added')) {
                    self.addClass('whislist-added');
                    self.find('.wishlist-text').text(theme.strings.remove_wishlist);

                    var title = self.parents('.product-single').find('.product-single__title').html();
                    var image = self.parents('.product-single').attr('data-wishlist-img');
                    $('.loading-modal').find('.product-title').html(title);
                    $('.loading-modal').find('.product-image').attr('src', image);
                    $('.loading-modal').find('.btn-wishlist').show();
                    $('.loading-modal').css({"opacity": "1", "visibility": "initial", "transform": "translateX(0)", "transition": "all 0.3s"});
                    $('.loading-modal').addClass('novload');
                    setTimeout(function() {
                        $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
                        $('.loading-modal').removeClass('novload');
                    }, 5000);

                    if ($('[data-wishlist-container]').length) {
                        nov.createNovWishListTplItem(ProductHandle);
                    };

                    wishListsArr.push(ProductHandle);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

                } else {
                    self.removeClass('whislist-added');
                    self.find('.wishlist-text').text(theme.strings.addto_wishlist);
                    if ($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                        $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                    }

                    wishListsArr.splice(idxArr, 1);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
                };

                nov.setNovAddedForWishlistIcon(ProductHandle);
            });
        },
        
        createNovWishListTplItem: function(ProductHandle) {
            var wishListCotainer = $('[data-wishlist-container]');

            jQuery.getJSON(window.router + '/products/'+ProductHandle+'.js', function(product) {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, theme.moneyFormat),
                    compare_at_price_min = Shopify.formatMoney(product.compare_at_price_min, theme.moneyFormat);

                    var currentDate = new Date();
                    var formattedDate = formatDate(currentDate);
                    function formatDate(date) {
                        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        var month = months[date.getMonth()];
                        var day = date.getDate();
                        var year = date.getFullYear();
                        return month + ' ' + pad(day) + ', ' + year;
                    }

                    function pad(num) {
                        return num < 10 ? '0' + num : num;
                    }

                productHTML += '<div class="item d-sm-flex align-items-center" data-wishlist-added="wishlist-'+product.id+'">';
                productHTML += '<div class="item-product" data-product-id="product-'+product.handle+'">';
                productHTML += '<a class="whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><i class="rbb-icon-delete-outline-2"></i></a>'
                productHTML += '<div class="thumbnail-container ratio-'+theme.strings.product_img_ratio+'">';
                productHTML += '<a href="'+product.url+'">';
                productHTML += '<img class="product__thumbnail" src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">'
                productHTML += '</a>'
                productHTML += '</div>';
                productHTML += '<div class="product__info">';
                productHTML += '<div class="product__title"><a href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></div>';
                if (compare_at_price_min > price_min) {
                    productHTML += '<div class="price-sale">';
                    productHTML += '<span class="special-price" data-price-grid>'+ price_min +'</span>';
                    productHTML += '<span class="old-price" data-compare-price-grid>'+ compare_at_price_min +'</span>';
                    productHTML += '</div>';
                } else {
                    productHTML += '<div class="price-regular">';
                    productHTML += '<span data-price-grid>'+ price_min +'</span>';
                    productHTML += '</div>';
                }
                productHTML += '<div class="product__created mt-5"><i class="zmdi zmdi-calendar-note"></i>'+formattedDate+'</div>';
                productHTML += '</div>';
                productHTML += '</div>';
                productHTML += '<a class="btnProductQuickview btn mt-xs-40" href="#" data-url="/products/'+product.handle+'?view=quick_view" data-product-url="/products/'+product.handle+'"  data-handle="'+product.handle+'" data-pid="'+product.id+'">';
                productHTML += '<span>'+ theme.strings.quickview +'</span>';
                productHTML += '</a>';
                productHTML += '</div>';

                wishListCotainer.append(productHTML);
            });
        },
        
        initAddToCart : function(image, title) {
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
          $.ajax({
            url: baseUrl + '/cart/?view=upsell',
            dataType: 'html',
            type: 'GET',
            beforeSend : function (){
              $('body').addClass('cart_popup_opened');
            },
            success: function(data) {
              $.magnificPopup.open({
                items: {
                  src: '<div class="nov-with-anim product-quickview popup-quick-view cart__popup cart__popup_upsell"><div id="content_cart__popup_nt">' + data + '</div></div>',
                  type: 'inline'
                },
                removalDelay: 500,
                closeMarkup: '<i class="close-icon nov-close"></i>',
                callbacks: {
                  beforeOpen: function() {
                    this.st.mainClass = 'nov-move-horizontal';
                  },
                  open: function() {
                    nov.PopupAddToCart();
                    if ($('html').hasClass('lang-rtl'))
                         rtl = true;
                     else
                         rtl = false;
                    $('.product-related-slider').slick({
                        nextArrow: '<div class="arrow-next">' + theme.icon_next +'</div>',
                        prevArrow: '<div class="arrow-prev">' + theme.icon_prev +'</div>',
                        rtl: rtl,
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        arrows: false,
                        dots: true,
                        infinite: true,
                        responsive: [
                            { 
                                breakpoint: 992, 
                                settings: { 
                                    slidesToShow: 2, 
                                    slidesToScroll: 2,
                                } 
                            },
                            { 
                                breakpoint: 768, 
                                settings: { 
                                    slidesToShow: 1, 
                                    slidesToScroll: 1,
                                } 
                            }
                        ]
                    });
                  },
                  change: function() { },
                  close: function() {
                    if($('body').hasClass('template-cart')) {
                      window.location.reload();
                    }
                    else {
                      $('body').removeClass('loading');
                      $('#content_cart__popup_nt').empty();
                    }
                  }
                },
              });
            },
            complete: function() {
              nov.PopupAddToCart();
              $('.loader').remove();
              if (title) {
                var cartMessage = '<div class="cart-message">' +
                  '<i class="zmdi zmdi-notifications-active"></i><strong>' +
                  title  +'</strong> - '+ theme.strings.cart_message_html +
                  '</div>';
                $('.cart-popup-heading').after(cartMessage);
                setTimeout(function() {
                    $(".cart-message").slideUp();
                }, 4000);
              }
            },
            error: function() {
              $('.loader').remove();
            }
          });
        },
        
        updateMiniCart: function() {
          Shopify.getCart(function(cart) {
            nov.doUpdateMiniCart(cart);
          });
        },

        doUpdateMiniCart: function(cart) {
            $('.CartCount, #CartCountCavas').text(cart.item_count);
            $('#header-cart-total').html(Shopify.formatMoney(cart.total_price, theme.moneyFormat));
            $('.cart-popup-heading span').html('There are ' + cart.item_count + ' item(s) in your cart');
        },

        ajaxChangeFromCart: function() {
          $( document ).on( 'change','.cart__popup-qty--input, .cart__mini-qty--input', function( e ) {
            e.preventDefault();
          })
        },
              
        PopupAddToCart: function() {
          function PopupUpdateCart(_id, new_qty) {
            $('.cart__popup').addClass('loading');
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            $.ajax({
                type: 'POST',
                url: baseUrl + '/cart/change.js',
                data: 'quantity=' + new_qty + '&id=' + _id,
                dataType: 'json',
                success: function (cart) {
                jQuery.get(baseUrl + '/cart?view=up_ajax', function (data) {
                    data = jQuery(data);
                    var sdata = jQuery(data);
                    var t_html = jQuery(sdata.get(0)).html(),
                        t_threshold = jQuery(sdata.get(2)).html(),
                        t_total = $('.cart__popup #' + _id).find('.cart__popup-total .amount');

                    $('.cart__popup #' + _id).find('.cart__popup-qty--input').val(new_qty);

                    var price = parseFloat(t_total.data('price')) * new_qty;
                    t_total.html(Shopify.formatMoney(price, theme.moneyFormat));
                    $('#cart__popup_total').html(t_html);
                    $('#threshold_bar_popup').html(t_threshold);
                }).always(function () {
                    $('.cart__popup').removeClass('loading');
                });

                $.get(baseUrl + '/cart?view=json', function (data) {
                    $('#cart-info').html(data);
                    }).always(function () {
                        nov.updateMiniCart();
                    });
                },
                error: function (XMLHttpRequest, textStatus) {
                    $('.cart__popup').removeClass('loading');
                }
            });
          }
          
          $(document).on('click', '.cart__popup-qty', function (e) {
            e.preventDefault();
            var $this = $(this),
                $qty = $this.siblings('.cart__popup-qty--input'),
                $id = $qty.attr('data-id'),
                $qtyinput = parseFloat($qty.val()),
                $step = parseFloat($qty.attr('step')),
                $min = parseFloat($qty.attr('min')),
                $max = parseFloat($qty.attr('max'));
            
            if ($this.hasClass('cart__popup-qty--plus')) {
              var $newqty = $qtyinput + $step;
              if ($newqty > $max && $max > 0) {
                $qty.val($max);
                return;
              }
            }
            else if ($this.hasClass('cart__popup-qty--minus')) {
              var $newqty = $qtyinput - $step;
              if ($newqty === 0) {
                var last_qty = parseInt($qty.attr('value'));
                $qty.val(last_qty);
                $this.parents('.cart__popup-item').find('.cart__popup-remove').trigger('click');
                return;
              } else if ($newqty < $min) {
                return;
              } else if ($qtyinput < 0) {
                alert('Invalid');
                return;
              }
            }
            
            PopupUpdateCart($id, $newqty);
          });
          var canTriggerEvent = true;
          $(document).on('click', '.cart__popup-remove', function (e) {
            e.preventDefault();
            
            var $this = $(this),
                $qty = $this.siblings('.cart__popup-quantity').find('.cart__popup-qty--input'),
                $id = $this.find('a').attr('data-product-id'),
                $qtyinput = parseInt($qty.val()),
                $ptitle = $this.parent('.cart__popup-item').find('.cart__popup-title a').text();
            $('.cart__popup .cart-message').slideDown();
            if (canTriggerEvent) {
                setTimeout(function() {
                  $('.cart__popup .cart-message').slideUp();
                }, 4000);
                canTriggerEvent = false
                setTimeout(function () {
                  canTriggerEvent = true;
                }, 4000);
            }
            $('.cart__popup').addClass('loading');
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            $.ajax({
              type: 'POST',
              url: baseUrl + '/cart/change.js',
              data: 'quantity=0&id=' + $id,
              dataType: 'json',
              success: function (cart) {
                jQuery.get(baseUrl + '/cart?view=up_ajax', function (data) {}).always(function (data) {
                  data = jQuery(data);
                  var sdata = jQuery(data);
                  var t_html = jQuery(sdata.get(0)).html(),
                      t_threshold = jQuery(sdata.get(2)).html();
                  $('#cart__popup_total').html(t_html);
                  $('#threshold_bar_popup').html(t_threshold);
                  $('.cart__popup #' + $id).addClass('hide');
                  if ($qtyinput > 0) {
                    $('#' + $id + ' input').val($qtyinput)
                  } else {
                    $('.cart__popup #' + $id + ' input').val(1)
                  }
                  
                  
                  $('.cart__popup .cart-message').html('<i class="rbb-icon-delete-outline-2"></i> <strong>'+ $ptitle +'</strong> - has been removed into your shopping cart.');
                  
                  $('.cart__popup .cart-message').removeClass('removed').addClass('removed');
                  
                  $('.cart__popup').removeClass('loading');
                  
                  $this.parents('.cart__popup-item').remove();
                });
                
                $.get(baseUrl + '/cart?view=json', function (data) {
                  $('#cart-info').html(data);
                }).always(function () {
                  
                  nov.updateMiniCart();
                });
              }
            })
          });
        },

        initMiniCart: function() {
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            $.get(baseUrl + '/cart?view=extend', function(data) {
                var $data = $(data);
                var note = $data.find('[data-label="note"]').html();
                var shipping_calculator = $data.find('[data-label="estimate-shipping"]').html();
                var discount = $data.find('[data-label="discount"]').html();
                jQuery.getJSON(baseUrl + "/cart.js", function (cart) {
                $('.CartCount, #CartCountCavas').text(cart.item_count);
                $('#cart-info').html('');
                $('#desktop_cart').addClass('item_count');
                    if (cart.item_count > 0) {
                        var html = '';
                        html += '<form action="/cart" method="post" class="cart ajaxcart">';
                        html += '<input class="js-form-discount" type="hidden" name="discount" value="">'
                        html += '<div class="ajaxcart__inner">';
                        html += '<div class="ajaxcart__inner--content">';
                            for (var i = 0; i < cart.items.length; i++) {
                                var image = Shopify.resizeImage(cart.items[i].image, '220x');
                                var price = Shopify.formatMoney(cart.items[i].price, theme.moneyFormat);

                                html += '<div class="ajaxcart__product" data-line="'+i+'">';
                                html += '<div class="media">';
                                html += '<a href="'+cart.items[i].url+'" class="position-relative">';
                                html += '<img class="d-flex ratio-'+theme.strings.product_img_ratio+'" src="'+image+'" alt="'+cart.items[i].title+'" title="'+cart.items[i].title+'">';
                                html += '</a>';
                                html += '<div class="media-body">';
                                html += '<a class="product-name" href="'+cart.items[i].url+'">';
                                html += '<span class="title">'+cart.items[i].product_title+'</span>';
                                if (cart.items[i].variant_title)
                                html += '<span class="bt_s">'+cart.items[i].variant_title+'</span>';
                                html += '</a>';
                                html += '<div class="mb-5"></div>';
                                html += '<span class="product-price price-st"><span class="money">'+price+'</span></span>';
                                //html += '<span class="quantity"> x '+cart.items[i].quantity+'</span>';


                                html += '<div class="cart__item-bottom d-flex align-items-center mt-10">';
                                html += '<div class="cart__mini--qty d-flex align-items-center">';
                                html += '<a class="cart__mini-qty cart__mini-qty--minus" href="#" aria-label="Reduce quantity">-</a>';
                                html += '<input class="cart__mini-qty--input" type="number" name="updates[]" id="updates_'+cart.items[i].key+'" data-price="'+ cart.items[i].price +'" data-id="'+cart.items[i].id+'" data-line="'+ i +'" step="1" value="'+cart.items[i].quantity+'" min="1" max="" pattern="[0-9]*" aria-label="'+ (theme.strings.quantity || 'Quantity') +'" />';
                                html += '<a class="cart__mini-qty cart__mini-qty--plus" href="#" aria-label="Increase quantity">+</a>';
                                html += '</div>';
                                html += '<span class="remove-from-cart" rel="nofollow" href="#" title="remove from cart" data-line="'+i+'" data-product-id="'+cart.items[i].id+'"><i class="rbb-icon-delete-outline-2"></i></span>';
                                html += '</div>';


                                html += '</div>';
                                html += '</div>';
                                html += '</div>';
                            }
                        html += '</div>';
                        html += '</div>';

                        html += '<div class="ajaxcart__footer">';
                        html += '<div class="subtotal d-flex align-items-center justify-content-between">';
                        html += '<label>'+ theme.strings.total +'</label>';
                        html += '<span class="price-st">'+Shopify.formatMoney(cart.total_price, theme.moneyFormat)+'</span>';
                        html += '</div>';
                        html += '<div class="cart_extend--label row spacing-0 d-md-none mb-15">';
                        if (theme.cart_note == true) {
                            html += '<div class="extend--label__item col" data-label="note">';
                            html += ''+ note +'';
                            html += '</div>';
                        }
                        if (theme.cart_shipping_calculator == true) {
                            html += '<div class="extend--label__item col" data-label="estimate-shipping">';
                            html += ''+ shipping_calculator +'';
                            html += '</div>';
                        }
                        if (theme.cart_discount_code == true) {
                            html += '<div class="extend--label__item col" data-label="discount">';
                            html += ''+ discount +'';
                            html += '</div>';
                        }
                        html += '</div>';
                        var price = cart.total_price;
                        var freeshipping_value = theme.freeshipping_value;
                        if (theme.show_free_shipping == true) {
                            if (parseFloat(price/100) < parseFloat(freeshipping_value)) {
                                var price_remain = (parseFloat(freeshipping_value) - parseFloat(price/100)).toFixed(0);

                                html += '<div id="threshold_bar_popup_minicart">';
                                html += '<div class="cart_threshold">';
                                html += '<div class="threshold_spend">'+ theme.strings.spend +' '+Shopify.formatMoney(price_remain*100, theme.moneyFormat)+' '+ theme.strings.spend__html +'</div>';
                                html += '<div class="threshold_bar">';
                                html += '<span class="animate" style="width:'+(price/freeshipping_value).toFixed(0)+'%!important">';
                                html += '<span><i class="rbb-icon-delivery-11"></i></span>';
                                html += '</span>';
                                html += '</div>';
                                html += '</div>';
                                html += '</div>';
                            }
                            else {
                                html += '<div id="threshold_bar_popup_minicart">';
                                html += '<div class="threshold_spend spend_congrats"><span>'+ theme.strings.content_threshold +'<i class="rbb-icon-delivery-11"></i></span></div>';
                                html += '<div class="threshold_bar threshold_congrats"><span class="animate" style="width: 100% !important;"><span><i class="rbb-icon-delivery-11"></i></span></div>';
                                html += '</div>';
                            }
                        }
                        html += '<div class="btn_submit">';
                        if (theme.terms_conditions_enable == true) {
                            html += '<input type="checkbox" name="checkout__input" value="1" id="checkout__canvas" class="hide">';
                        }
                        html += '<a href="/cart" class="btn btn-success"><span>'+ theme.strings.view_cart +'</span></a>';
                        html += '<button type="submit" class="btn btn-secondary cart__checkout" name="checkout"><span>'+ theme.strings.check_out +'</span></button>';
                        if (theme.terms_conditions_enable == true) {
                            html += '<label for="checkout__canvas" class="d-flex align-items-center mt-20">';
                            html += '<span class="custom-checkbox pointer d-inline-flex align-items-center justify-content-center"><i class="zmdi zmdi-check"></i></span>';
                            html += '<span class="label__text">'+ theme.proceed_to_checkout +'</span>';
                            html += '</label>';
                        }
                        html += '</div>';
                        html += '</div>';
                        html += '</form>';
                        $('#cart-info').append(html);
                        $('#header-cart-total').html(Shopify.formatMoney(cart.total_price, theme.moneyFormat));
                        var i = $('.ajaxcart__inner').outerHeight();
                        var f = $('.ajaxcart__footer').outerHeight();
                        var c = $('.ajaxcart').height() - 30;
                        if (i + f >= c) {
                            $('.ajaxcart__footer').addClass('h_scroll');
                        }
                        if(!$('.form-cart__extent').length) {
                            nov.initCartExtend();
                        }
                    } else {
                        var link_collection = $('.link_to_collection_cart_empty').html();
                        var html = '';
                        html += '<div class="cart cart_empty">';
                        html += '<div class="cart_empty_img"></div>';
                        html += '<div class="empty_title text-center">'+ theme.strings.cart_empty +'</div>';
                        html += '<div class="text-center mt-40 block_link_cart">';
                        html += ''+ link_collection +'';
                        html += '</div>';
                        html += '</div>';
                        $('#cart-info').append(html);
                        $('#header-cart-total').html('$0.00');
                        $('#desktop_cart').removeClass('item_count');
                        $('.form-cart__extent').remove();
                    }
                })
            });
        },
        ajaxProductAddToCart: function() {
          $(document).on('click', '.product-form__cart-submit', function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.addClass('loading');
            $('.lookbook-modal').modal('hide');
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            $.ajax({
              type: 'POST',
              url: baseUrl + '/cart/add.js',
              data: $this.parents('form').serialize(),
              dataType: 'json',
              success:function( cart ) {
                $.get(baseUrl + '/cart?view=json', function(data) {
                  $('#cart-info').html(data);
                }).always(function() {
                  if (theme.cart_status == 'show_popup') {
                  	nov.initAddToCart(cart.image, cart.title);
                  }
                  if(!$('.form-cart__extent').length) {
                    nov.initCartExtend();
                  }
                  nov.updateMiniCart();
                  
                  nov.PopupAddToCart();
                  
                    $this.removeClass("loading");
                  $('.cart_extend').removeClass('act');
                  $('.cart_extend--label').removeClass('act');
                });
              },
              complete: function() {
                if (!$('.product-form__cart-submit').parents('.cart_popup_opened').length) {
                    $('body').removeClass('cart_popup_opened');
                }
                $('body').removeClass('loading');
                $('.nov-close, .cart_popup_opened .nov-ready').on('click', function() {
                  if($('body').hasClass('template-cart')) {
                    window.location.reload();
                  }
                })
                if (theme.cart_status == 'show_minicart') {
                    setTimeout(function() {
                        $("#desktop_cart").addClass('active');
                        $(".sidebar-overlay").addClass('act');
                    }, 1000);
                }
                $(document).find('.nov-close').trigger('click');
              },
              error: function(XMLHttpRequest, textStatus) {
                $this.removeClass("loading").css('pointer-events', 'auto').find('.add-to-cart-text').text(window.inventory_text.sold_out);
                let response = XMLHttpRequest.responseJSON;
                let errorMessage = response && response.description ? response.description : theme_cart_add_error;

                if (errorMessage === 'The maximum quantity of this item is already in your cart.') {
                    errorMessage = theme_cart_max_quantity;
                }
                const $errorBox = $this.closest('.product-card').find('.errors.cart-error');

                $errorBox.stop(true, true).hide().text(errorMessage).slideDown();
                $this.prop('disabled', true).css('pointer-events', 'none');
                setTimeout(function () {
                    $errorBox.slideUp();
                    $this.prop('disabled', false).css('pointer-events', 'auto');
                }, 5000);
              }
            }).done(function() {
                $('body').removeClass('loading');
            })
          })
        },
        initQuickView: function() {
          $(document).on('click', '.btnProductQuickview', function(e) {
            e.preventDefault();
            $('.lookbook-modal').modal('hide');
            var $this = $(this);
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            $.ajax({
                beforeSend : function (){
                    $('body').addClass('open_gl_quick_view');
                },
                url: baseUrl + $this.attr('data-url'),
                success: function(data) {
                    $.magnificPopup.open({
                     items: {
                       src: '<div class="nov-with-anim popup-quick-view" id="content_quickview">' + data + '</div>',
                       type: 'inline'
                     },
                     removalDelay: 500,
                     closeMarkup: '<i class="nov-close close-icon"></i>',
                     callbacks: {
                       beforeOpen: function() {
                         this.st.mainClass = 'nov-move-horizontal';
                       },
                       open: function() {
                         if ($('html').hasClass('lang-rtl'))
                              rtl = true;
                          else
                              rtl = false;
                         var featuredSlick = $('.popup-quick-view').find('.FeaturedImage_slick')
                         featuredSlick.slick({
                             nextArrow: '<div class="arrow-next">'+ theme.icon_next +'</div>',
                             prevArrow: '<div class="arrow-prev">' + theme.icon_prev +'</div>',
                             rtl: rtl,
                             slidesToShow: 1,
                             slidesToScroll: 1,
                             arrows: true,
                             dots: false,
                             infinite: true
                         });
                         $('product-variant-swatch label').click(function () {
                              setTimeout(function() {
                                  var dindex = featuredSlick.find('.item.act').attr('data-slick-index');
                                  featuredSlick.slick('slickGoTo', dindex);
                              }, 300);
                          })
                         Shopify.PaymentButton.init();
                         
                         
                        if (show_wishlist == true) {
                            nov.initNovWishListIcons();
                        }
                         jQuery('product-variant-swatch :radio').change(function() {
                           var optionValue = jQuery(this).val();
                           jQuery(this).parents('fieldset').find('.variant_current').text(optionValue);
                         });
                         $(document).on('click', '#content_quickview .product-form__item--submit', function(){
                            $('#content_quickview .nov-close').trigger('click');
                         });
                       },
                       close: function() {
                         $('#content_quickview').empty();
                         $('body').removeClass('open_gl_quick_view');
                         $('body').removeClass('cart_popup_opened');
                         $('body').find('.tooltip').remove();
                       }
                     },
                    });
                },
                complete: function() {
                    Shopify.PaymentButton.init();
                }
            }).done(function() {
                $this.removeClass('btn-loading');
                $('body').removeClass('loading');
                $('body').find('.tooltip').remove();
            })
            const product_url = this.getAttribute('data-product-url');
            fetch(product_url)
                .then((response) => response.text())
                .then((responseText) => {
                    const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
                    const productContainer = responseHTML.querySelector('.product-template__container');
                    if (!productContainer) return;
                    const sectionId = productContainer.getAttribute('data-section-id');
                    const content_quickview = document.getElementById("content_quickview");
                    if (!content_quickview) return;

                    content_quickview.querySelector('.product-template__container').id = 'ProductSection-' + sectionId;
                    if (content_quickview.querySelector('product-variant-swatch, product-variant-dropdown') !== null) {
                        content_quickview.querySelector('product-variant-swatch, product-variant-dropdown').setAttribute('data-product-id', sectionId);
                    }
                    content_quickview.querySelector('#ProductPrice-templateQV').id = 'ProductPrice-' + sectionId;
                    if (content_quickview.querySelector('#ComparePrice-templateQV')) {
                        content_quickview.querySelector('#ComparePrice-templateQV').id = 'ComparePrice-' + sectionId;
                    }
                    content_quickview.querySelector('form').id = 'product-form-' + sectionId;
                    item = content_quickview.querySelectorAll('.FeaturedImage_slick .item');
                    for (var i = 0; i < item.length; i++) {
                        mediaId = item[i].getAttribute('data-media-id');
                        item[i].setAttribute('data-media-id', sectionId + mediaId);
                    }
                    input = content_quickview.querySelectorAll('input[type=radio]');
                    for (var i = 0; i < input.length; i++) {
                        input[i].setAttribute('form', 'product-form-' + sectionId);
                    }
                })
            })
        },
        ajaxRemoveFromCart: function() {
          $('#cart-info').on('click', '.remove-from-cart', function(e){
            e.preventDefault();
            
            var $this = $(this),
                $id = $this.attr('data-product-id');
            var baseUrl = window.router || '';
            if (baseUrl === '/') {
                baseUrl = '';
            } else if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            $.ajax({
              type: 'POST',
              url: baseUrl + '/cart/change.js',
              data: 'quantity=0&id=' + $id,
              dataType: 'json',
              success: function (cart) {
                if ($('body').hasClass('template-cart')) {
                  window.location.reload();
                }
                else {
                  nov.initMiniCart();
                }
              }
            })
          });
        },
        changeQuantityMiniCart: function() {
            function MiniCartUpdate(_id, new_qty) {
                var baseUrl = window.router || '';
                if (baseUrl === '/') {
                    baseUrl = '';
                } else if (baseUrl.endsWith('/')) {
                    baseUrl = baseUrl.slice(0, -1);
                }
                $.ajax({
                    type: 'POST',
                    url: baseUrl + '/cart/change.js',
                    data: 'quantity=' + new_qty + '&id=' + _id,
                    dataType: 'json',
                    success: function (cart) {
                    jQuery.get(baseUrl + '/cart?view=up_ajax', function (data) {
                        data = jQuery(data);
                        var sdata = jQuery(data);
                        var t_html = jQuery(sdata.get(0)).html(),
                            t_threshold = jQuery(sdata.get(2)).html();
                            t_total = $('#cart-info').find('.subtotal');
                        $('#cart-info').find('.subtotal span').html(t_html);
                        $('#threshold_bar_popup_minicart .cart_threshold').html(t_threshold);
                    }).always(function () {
                    });

                    $.get(baseUrl + '/cart?view=json', function (data) {
                        $('#cart-info').html(data);
                        }).always(function () {
                            nov.updateMiniCart();
                        });
                    },
                });
            }
            $(document).on('click', '.cart__mini-qty', function (e) {
                e.preventDefault();
                var $this = $(this),
                    $qty = $this.siblings('.cart__mini-qty--input'),
                    $id = $qty.attr('data-id'),
                    $qtyinput = parseFloat($qty.val()),
                    $step = parseFloat($qty.attr('step')),
                    $min = parseFloat($qty.attr('min')),
                    $max = parseFloat($qty.attr('max'));
                if ($this.hasClass('cart__mini-qty--plus')) {
                    var $newqty = $qtyinput + $step;
                    if ($newqty > $max && $max > 0) {
                        $qty.val($max);
                        return;
                    } else {
                         $qty.val($newqty);
                    }
                } else if ($this.hasClass('cart__mini-qty--minus')) {
                    var $newqty = $qtyinput - $step;
                    if ($newqty === 0) {
                        var last_qty = parseInt($qty.attr('value'));
                        $qty.val(last_qty);
                        $this.parents('.ajaxcart__product').find('.remove-from-cart').trigger('click');
                        return;
                    } else if ($newqty < $min) {
                        return;
                    } else if ($qtyinput < 0) {
                        return;
                    }
                    else {
                        $qty.val($newqty);
                    }
                }

                MiniCartUpdate($id, $newqty);
            });
            $(document).on('change', '.cart__mini-qty--input', function (e) {
                var $this = $(this),
                $newqty = parseFloat($this.val()),
                $id = $this.attr('data-id'),
                $min = parseFloat($this.attr('min')),
                $max = parseFloat($this.attr('max'));
                if ($newqty > $max && $max > 0) {
                    $qty.val($max);
                    return;
                }
                if ($newqty === 0) {
                    $this.parents('.ajaxcart__product').find('.remove-from-cart').trigger('click');
                    return;
                }
                MiniCartUpdate($id, $newqty);
            });
        },
        changeQuantityPageCart: function() {
            function ShopifyCartChange(variant_id, quantity, callback) {
                var params = {
                    type: 'POST',
                    url: '/cart/change.js',
                    data:  'quantity='+quantity+'&line='+variant_id,
                    dataType: 'json',
                    success: function(cart) { 
                        if ((typeof callback) === 'function') {
                            callback(cart);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus) {
                    }
                };
                jQuery.ajax(params);
            }

            $( document ).on( 'change keyup', '.cart__qty-input, .cart__popup-qty--input', function() {
                var $this = $(this);
                var line = $this.data('line'),
                val = parseInt($this.val()),
                price = $this.data('price'),
                max = $this.attr('max');
                if(isNaN(val)) return 0;

                max = isNaN(parseInt(max)) ? 9999: parseInt(max);
                if(val > max ){
                    $this.attr('value', max).val(max);
                }
                val = (val > max) ? max : val;
                if(val <= 0 ){
                    $this.closest('tr').remove();
                }

                ShopifyCartChange(line, val, function(res){
                    $('.cart__subtotal').html(Shopify.formatMoney(res.total_price, theme.moneyFormat));

                    $this.parents('.cart_item').find('.product-subtotal').html(Shopify.formatMoney(price * val, theme.moneyFormat));

                    $('.CartCount, #CartCountCavas').html(res.item_count);

                    $('.cart__heading span').html('There are '+res.item_count+' items in your cart');


                    jQuery.get('/cart?view=ship', function(data) {
                        $('#threshold_bar_popup').html(data);
                        setTimeout(function() {
                        }, 200);   
                    });
                    $.get('/cart?view=json', function (data) {
                        $('#cart-info').html(data);
                    }).always(function () {
                        nov.updateMiniCart();
                    });
                });
            });

            $( document ).on( 'click', '.plus, .minus', function() {
                var $qty = $( this ).closest( '.cart__qty' ).find( '.cart__qty-input'),
                currentVal = parseFloat( $qty.val() ),
                max = parseFloat( $qty.attr( 'max' ) ),
                min = parseFloat( $qty.attr( 'min' ) ),
                step = $qty.attr( 'step' );

                if (! currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
                if (max === '' || max === 'NaN') max = '';
                if (min === '' || min === 'NaN') min = 0;
                if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;

                if ($(this).is( '.plus')) {
                    if ( max && (currentVal >= max)) {
                        $qty.val( max );
                    } else {
                        $qty.val((currentVal + parseFloat(step)));
                    }
                } else {
                    if ( min && ( currentVal <= min ) ) {
                        $qty.val( min );
                    } else if (currentVal > 0) {
                        $qty.val((currentVal - parseFloat( step )));
                    }
                }
                $qty.trigger( 'change' );
            });

            $( document ).on( 'click', '.quick_view-qty-plus, .quick_view-qty-minus', function() {
                var $qty = $(this).closest( '.quick_view_qty' ).find( 'input[name="quantity"]'),
                currentVal = parseFloat($qty.val()),
                max = parseFloat($qty.attr('max')),
                min = parseFloat($qty.attr('min')),
                step = $qty.attr('step');

                if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
                if (max === '' || max === 'NaN') max = '';
                if (min === '' || min === 'NaN') min = 0;
                if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;

                if ($(this).is( '.quick_view-qty-plus')) {
                    if ( max && (currentVal >= max)) {
                        $qty.val( max );
                    } else {
                        $qty.val((currentVal + parseFloat(step)));
                    }
                } else {
                    if ( min && ( currentVal <= min ) ) {
                        $qty.val( min );
                    } else if (currentVal > 0) {
                        $qty.val((currentVal - parseFloat( step )));
                    }
                }
            });
        },
        initCartExtend: function() {
            jQuery.get('/cart?view=extend', function(data) {
                $('.block_cart_top').before(data);
                if ($('html').hasClass('lang-rtl')) {
                    $('.extend--label__item').attr('data-placement','right');
                } else {
                    $('.extend--label__item').attr('data-placement','left');
                }
            });
            setTimeout(function () {
                if ($('#shipping-calculator').length > 0) {
                    "object"==typeof Countries&&(Countries.updateProvinceLabel=function(e,t){if("string"==typeof e&&Countries[e]&&Countries[e].provinces){if("object"!=typeof t&&(t=document.getElementById("address_province_label"),null===t))return;t.innerHTML=Countries[e].label;var r=jQuery(t).parent();r.find("select");r.find(".custom-style-select-box-inner").html(Countries[e].provinces[0])}}),"undefined"==typeof Shopify.Cart&&(Shopify.Cart={}),Shopify.Cart.ShippingCalculator=function(){var _config={submitButton:"Calculate shipping",submitButtonDisabled:"Calculating...",templateId:"shipping-calculator-response-template",wrapperId:"wrapper-response",customerIsLoggedIn:!1,moneyFormat:"${{amount}}"},_render=function(e){var t=jQuery("#"+_config.templateId),r=jQuery("#"+_config.wrapperId);if(t.length&&r.length){var templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var n=Handlebars.compile(jQuery.trim(t.text())),a=n(e);if(jQuery(a).appendTo(r),"undefined"!=typeof Currency&&"function"==typeof Currency.convertAll){var i="";jQuery("[name=currencies]").length>0?i=jQuery("[name=currencies]").val():jQuery("#currencies span.selected").length>0&&(i=jQuery("#currencies span.selected").attr("data-currency")),""!==i&&Currency.convertAll(shopCurrency,i,"#wrapper-response span.money, #estimated-shipping span.money")}}},_enableButtons=function(){jQuery(".get-rates").removeAttr("disabled").removeClass("disabled").val(_config.submitButton)},_disableButtons=function(){jQuery(".get-rates").val(_config.submitButtonDisabled).attr("disabled","disabled").addClass("disabled")},_getCartShippingRatesForDestination=function(e){var t={type:"POST",url:"/cart/prepare_shipping_rates",data:jQuery.param({shipping_address:e}),success:_pollForCartShippingRatesForDestination(e),error:_onError};jQuery.ajax(t)},_pollForCartShippingRatesForDestination=function(e){var t=function(){jQuery.ajax("/cart/async_shipping_rates",{dataType:"json",success:function(r,n,a){200===a.status?_onCartShippingRatesUpdate(r.shipping_rates,e):setTimeout(t,500)},error:_onError})};return t},_fullMessagesFromErrors=function(e){var t=[];return jQuery.each(e,function(e,r){jQuery.each(r,function(r,n){t.push(e+" "+n)})}),t},_onError=function(XMLHttpRequest,textStatus){jQuery("#estimated-shipping").hide(),jQuery("#estimated-shipping em").empty(),_enableButtons();var feedback="",data=eval("("+XMLHttpRequest.responseText+")");feedback=data.message?data.message+"("+data.status+"): "+data.description:"Error : "+_fullMessagesFromErrors(data).join("; ")+".","Error : country is not supported."===feedback&&(feedback="We do not ship to this destination."),_render({rates:[],errorFeedback:feedback,success:!1}),jQuery("#"+_config.wrapperId).show()},_onCartShippingRatesUpdate=function(e,t){_enableButtons();var r="";if(t.zip&&(r+=t.zip+", "),t.province&&(r+=t.province+", "),r+=t.country,e.length){"0.00"==e[0].price?jQuery("#estimated-shipping em").html("FREE"):jQuery("#estimated-shipping em").html(_formatRate(e[0].price));for(var n=0;n<e.length;n++)e[n].price=_formatRate(e[n].price)}_render({rates:e,address:r,success:!0}),jQuery("#"+_config.wrapperId+", #estimated-shipping").fadeIn()},_formatRate=function(e){function t(e,t){return"undefined"==typeof e?t:e}function r(e,r,n,a){if(r=t(r,2),n=t(n,","),a=t(a,"."),isNaN(e)||null==e)return 0;e=(e/100).toFixed(r);var i=e.split("."),o=i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+n),s=i[1]?a+i[1]:"";return o+s}if("function"==typeof Shopify.formatMoney)return Shopify.formatMoney(e,_config.moneyFormat);"string"==typeof e&&(e=e.replace(".",""));var n="",a=/\{\{\s*(\w+)\s*\}\}/,i=_config.moneyFormat;switch(i.match(a)[1]){case"amount":n=r(e,2);break;case"amount_no_decimals":n=r(e,0);break;case"amount_with_comma_separator":n=r(e,2,".",",");break;case"amount_no_decimals_with_comma_separator":n=r(e,0,".",",")}return i.replace(a,n)};return _init=function(){new Shopify.CountryProvinceSelector("address_country","address_province",{hideElement:"address_province_container"});var e=jQuery("#address_country"),t=jQuery("#address_province_label").get(0);"undefined"!=typeof Countries&&(Countries.updateProvinceLabel(e.val(),t),e.change(function(){Countries.updateProvinceLabel(e.val(),t)})),jQuery(".get-rates").click(function(){_disableButtons(),jQuery("#"+_config.wrapperId).empty().hide();var e={};e.zip=jQuery("#address_zip").val()||"",e.country=jQuery("#address_country").val()||"",e.province=jQuery("#address_province").val()||"",_getCartShippingRatesForDestination(e)}),_config.customerIsLoggedIn&&jQuery(".get-rates:eq(0)").trigger("click")},{show:function(e){e=e||{},jQuery.extend(_config,e),jQuery(function(){_init()})},getConfig:function(){return _config},formatRate:function(e){return _formatRate(e)}}}();
                    Shopify.Cart.ShippingCalculator.show( {
                      submitButton: theme.strings.shippingCalcSubmitButton,
                      submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
                      customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
                      moneyFormat: theme.strings.shippingCalcMoneyFormat
                    });
                }  
            }, 1000);
        },
        addAllToCart: function() {
            $(document).on('click', '.js_add_all_to_cart', function(e) {
                e.preventDefault();
                var $btn = $(this);
                var $list = $btn.closest('.block-product').find('.list--view-items');
                if (!$list.length) {
                    $list = $btn.closest('.container-inner').find('.list--view-items');
                }
                if (!$list.length) {
                    $list = $btn.closest('.row').find('.list--view-items');
                }
                var items = [];
                $list.find('.item-product[data-variant-id]').each(function() {
                    var variantId = parseInt($(this).data('variant-id'));
                    if (variantId) {
                        items.push({ id: variantId, quantity: 1 });
                    }
                });
                if (items.length === 0) {
                    return;
                }
                $btn.addClass('loading').css('pointer-events', 'none');
                var baseUrl = window.router || '';
                if (baseUrl === '/') {
                    baseUrl = '';
                } else if (baseUrl.endsWith('/')) {
                    baseUrl = baseUrl.slice(0, -1);
                }
                $.ajax({
                    type: 'POST',
                    url: baseUrl + '/cart/add.js',
                    data: JSON.stringify({ items: items }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
                        nov.initMiniCart();
        
                        if (theme.cart_status === 'show_popup') {
                            nov.initAddToCart(null, null);
                        }
                        if (theme.cart_status === 'show_minicart') {
                            setTimeout(function() {
                                $('#desktop_cart').addClass('active');
                                $('.sidebar-overlay').addClass('act');
                            }, 500);
                        }
                    },
                    error: function(xhr) {
                        try {
                            var res = JSON.parse(xhr.responseText);
                            alert(res.description || 'Could not add all items to cart.');
                        } catch(e) {
                            alert('Could not add all items to cart.');
                        }
                    },
                    complete: function() {
                        $btn.removeClass('loading').css('pointer-events', 'auto');
                    }
                });
            });
        }
    }
})(jQuery);
