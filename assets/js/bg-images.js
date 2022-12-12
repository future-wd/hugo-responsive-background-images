/* eslint-disable */
{{- /*    



  context: . - page context

*/ -}}
{{- /*$params := partial "bg-images/private/params/params" . */ -}}

{{- $list := .lazy_selectors | jsonify -}}
const list = {{ $list }};
const options = {
  rootMargin: {{ printf "'0px 0px %vpx 0px'" site.Params.bg_images.root_margin }},
}
/* eslint-enable */

const lazyClass = 'bg-lazy';
const loadedClass = 'bg-loaded';

document.addEventListener('DOMContentLoaded', () => {
  const lazyBgImages = document.querySelectorAll(list);

  if ('IntersectionObserver' in window) {
     // add bg-lazy class to show js has picked up the selector
    for (let i = 0; i < lazyBgImages.length; ++i) {
      lazyBgImages[i].classList.add(lazyClass);
    }

    let observer = new IntersectionObserver(callback, options);

    function callback(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.remove(lazyClass);
          img.classList.add(loadedClass);
          observer.unobserve(entry.target);
        }
      });
    }

    lazyBgImages.forEach(function (lazyBgImage) {
      observer.observe(lazyBgImage);
    });
  } else {
    // if no intersection observer support, don't bother with lazy load for now..
    // use for loop for browser support
    for (let i = 0; i < lazyBgImages.length; ++i) {
      lazyBgImages[i].classList.add(loadedClass);
    }
  }
});
