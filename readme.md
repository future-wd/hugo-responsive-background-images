# Hugo Responsive Background Images

TODO:

- add targetted images to class list for default css
- change class to selector
- rather than resize larger than image, resize to max size if *px (tolerance) larger than next break point down
- add front matter option of loading=lazy
- loop through pages and check for lazy=true and add to js???


## Installation

add the following to head to activate module

{{ partial "bg-images/head" . }}
  

## On-page usage

### Front matter

```yaml
bg-images:
- src: image1.png
  class: hero.responsive-bg-img
  widths: [500, 900, 1200] # optional override
  loading: lazy # optional see lazy load section for requirements
  ```
### Block

## JS

Add `<html class="no-js >`

Then add the following to top of `<head>` to replace `no-js` with `js` and add either `webp` or `no-webp`.

```
<script>
document.documentElement.className = document.documentElement.className.replace("no-js", "js");
async function supportsWebp() {
  if (!self.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  return createImageBitmap(blob).then(() => true, () => false);
}

(async () => {
  if(await supportsWebp()) {
    document.documentElement.classList.add('webp');
  }
  else {
    document.documentElement.classList.add('no-webp');
  }
})();
</script>
```

## Lazyloading

Remove `reponsive-bg-img` from the block element.

Add the following..... 
