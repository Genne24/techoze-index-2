const SCROLL_ANIMATION_TRIGGER_CLASSNAME = "scroll-trigger",
  SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = "scroll-trigger--offscreen",
  SCROLL_ZOOM_IN_TRIGGER_CLASSNAME = "animate--zoom-in",
  SCROLL_ANIMATION_CANCEL_CLASSNAME = "scroll-trigger--cancel";

function throttle(fn, wait = 100) {
  let time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn.apply(this, arguments);
      time = Date.now();
    }
  };
}

function onIntersection(elements, observer) {
  elements.forEach((element, index) => {
    if (element.isIntersecting) {
      const elementTarget = element.target;
      if (elementTarget.classList.contains(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME)) {
        elementTarget.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
        if (elementTarget.hasAttribute("data-cascade")) {
          if (!elementTarget.style.getPropertyValue('--animation-order')) {
            elementTarget.style.setProperty('--animation-order', index);
          }
        }
      }
      observer.unobserve(elementTarget);
    } else {
      element.target.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
      element.target.classList.remove(SCROLL_ANIMATION_CANCEL_CLASSNAME);
    }
  });
}

function assignCascadeOrder(rootEl = document, forcedSlidesToScroll = null) {
  const target = (rootEl && rootEl.querySelectorAll) ? rootEl : document;
  const containers = target.querySelectorAll(
    '.swiper-wrapper, .nov-swiper-carousel, .slick-track, .nov-slick-carousel, .grid--view-items, [data-row]'
  );

  containers.forEach(container => {
    const swiperRoot = container.closest('.nov-swiper-carousel') || (container.classList.contains('nov-swiper-carousel') ? container : null);
    const slickRoot = container.closest('.nov-slick-carousel, .slick-slider') || (container.classList.contains('nov-slick-carousel') || container.classList.contains('slick-slider') ? container : null);

    let groupSize = Infinity;

    if (swiperRoot) {
      if (swiperRoot.swiper && swiperRoot.swiper.params) {
        groupSize = swiperRoot.swiper.params.slidesPerGroup || 1;
      } else {
        groupSize = 1;
      }
    } else if (slickRoot) {
      let slidesToScroll = 1;
      if (typeof forcedSlidesToScroll === 'number' && forcedSlidesToScroll > 0) {
        slidesToScroll = forcedSlidesToScroll;
      } else if (slickRoot.slick && slickRoot.slick.options && typeof slickRoot.slick.options.slidesToScroll === 'number') {
        slidesToScroll = slickRoot.slick.options.slidesToScroll;
      } else {
        const slickChild = slickRoot.querySelector('.slick-initialized');
        if (slickChild && slickChild.slick && slickChild.slick.options && typeof slickChild.slick.options.slidesToScroll === 'number') {
          slidesToScroll = slickChild.slick.options.slidesToScroll;
        }
      }
      groupSize = (typeof slidesToScroll === 'number' && slidesToScroll > 0) ? slidesToScroll : 1;
    }

    let localIndex = 0;
    const items = container.querySelectorAll('.scroll-trigger[data-cascade]');
    items.forEach(el => {
      if (el.closest('.swiper-slide-duplicate, .slick-cloned')) return;
      const order = groupSize === Infinity ? localIndex : (localIndex % groupSize);
      el.style.setProperty('--animation-order', order);
      localIndex++;
    });
  });
}
window.assignCascadeOrder = assignCascadeOrder;

function initializeScrollAnimationTrigger(rootEl = document, isDesignModeEvent = false) {
  const target = (rootEl && rootEl.getElementsByClassName) ? rootEl : document;
  const animationTriggerElements = Array.from(target.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME));
  if (animationTriggerElements.length === 0) return;
  if (isDesignModeEvent) {
    animationTriggerElements.forEach(element => {
      element.classList.add("scroll-trigger--design-mode");
    });
    return;
  }

  assignCascadeOrder(rootEl);

  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: "0px 0px -50px 0px"
  });
  animationTriggerElements.forEach(element => observer.observe(element));
}

function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  const animationTriggerElements = Array.from(document.getElementsByClassName(SCROLL_ZOOM_IN_TRIGGER_CLASSNAME));
  if (animationTriggerElements.length === 0)
    return;
  const scaleAmount = .2 / 100;
  animationTriggerElements.forEach(element => {
    let elementIsVisible = false;
    new IntersectionObserver(elements => {
      elements.forEach(entry => {
        elementIsVisible = entry.isIntersecting;
      });
    }).observe(element);
    element.style.setProperty("--zoom-in-ratio", 1 + scaleAmount * percentageSeen(element));
    window.addEventListener("scroll", throttle(() => {
      elementIsVisible && element.style.setProperty("--zoom-in-ratio", 1 + scaleAmount * percentageSeen(element));
    }), {
      passive: true
    });
  });
}

function percentageSeen(element) {
  const viewportHeight = window.innerHeight,
    scrollY = window.scrollY,
    elementPositionY = element.getBoundingClientRect().top + scrollY,
    elementHeight = element.offsetHeight;
  if (elementPositionY > scrollY + viewportHeight)
    return 0;
  if (elementPositionY + elementHeight < scrollY)
    return 100;
  let percentage = (scrollY + viewportHeight - elementPositionY) / ((viewportHeight + elementHeight) / 100);
  return Math.round(percentage);
}

window.addEventListener("DOMContentLoaded", () => {
  initializeScrollAnimationTrigger();
  initializeScrollZoomAnimationTrigger();
});

if (window.jQuery) {
  window.jQuery(document).on('init reInit breakpoint setPosition', '.nov-slick-carousel, .slick-slider', function(event, slick) {
    const slidesToScroll = (slick && slick.options && typeof slick.options.slidesToScroll === 'number') ? slick.options.slidesToScroll : null;
    assignCascadeOrder(this, slidesToScroll);
  });
}

if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener("shopify:section:load", event => initializeScrollAnimationTrigger(event.target, true));
  document.addEventListener("shopify:section:reorder", () => initializeScrollAnimationTrigger(document, true));
}