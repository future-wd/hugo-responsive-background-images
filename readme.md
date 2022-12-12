# Hugo Responsive Background Images

This module generates background images at specified widths and generates CSS with respective breakpoints. There is an option to lazyload. All you need to do is specify the image (page resource) and CSS selector on the page's front matter.

Non lazyloaded images are prefetched so they start to load before the browser has downloaded and parsed the css file.

LQIP placeholders are still under development.

## Installation

### Initialize project

Initialize the project for use with hugo modules with `hugo mod init github.com/user/your_project_name`

### Load this module

Add this module via the site's config:

```yaml
# config.yaml
module:
  imports:
  - path: github.com/future-wd/hugo-responsive-background-images
```

### Add js/webp status script for webp and lazyloading support

Optionally add `<html class="no-js">`

Then add the following to top of `<head>` which will replace `no-js` with `js` and add either `webp` or `no-webp`.

```js
<script>
 const noJs = document.documentElement.classList.contains('no-js');
  if (noJs) document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  async function supportsWebp() {
    if (!self.createImageBitmap) return false;
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  }
  (async () => {
    if(await supportsWebp()) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  })();
</script>
```

### Add CSS partial

add the following to the site's head to load the generated CSS.

```html
{{ partial "bg-images/css" . }}
```

### Add JS partial for lazyloading support

Before `</body>` you need to add the following partial:

```html
{{ partial "bg-images/js" . }}
```

## Configuration

### Site config - Defaults shown

```yaml
# config.yaml 
bg_images:
  widths: [600, 1000, 1500, 2000] # resize widths.
  root_margin: 25 # pixels - distance below screen that image load will be triggered
  min_width_difference: 30 # tolerance for creating resize width of image width if image is narrower than widths
  suppress_width_warning: false # suppress warning that image is too narrow
  placeholder: false # default placeholder type for lazy loaded images
  lqip:
    div: 4
    blur: 5
```

### On page config - Front matter

```yaml
bg-images:
  widths: [...]
  root_margin:
  ... 
  images:
  - src: image1.png # page resource relative to the page's markdown file
    selector: .section--hero # css selector to which the background will be applied
    widths: [500, 900, 1200] # optional override
    lazy: true # optional see lazy load section for requirements (still experimental)
    placeholder: lqip/dominant/css color code # optional
    lqip: # optional override 
      div: 4
      blur: 5
```

### Change log

v0.04

- don't generate images wider than actual image.
- if widths removed, generate width equal to image width if image is TOLERANCE wider than new widest width
- markdown parameters are sanitized with error messages
- placeholder option of lqip/dominant/color code

#### TODO

v0.0.5

- use common utils - move to github repo - test 
- create options array, populate from image specific config then page params then site params
- use resources.Copy to rename lqip image resource for easy debug in browser
- change .resize.original and .resize.jpg to .resize.fallback and add configuration to disable jpg conversion
- add config santize
- add option of disable_jpg=true
- option for publish scss rather than compile to css and gen .RelPermalink
- add placeholder: jpg_quality, webp_quality and general jpg_quality, webp_quality
- input sanitization does not catch error if .src does not match image resource
- add fill ratio and oversize option to each width e.g.
  widths:
  - width: 600
    fill_ratio: [9,16]
    oversize: 100
  *OR*
  widths: [600, 900] (conditional transformation is nearly complete already)
- prefetch lazyload images after domcontentloaded fired

v0.0.6
- prefetch lazy webp placeholders
- fix placeholder blur, currently looks great but increases lqip size x5

# md
bg-image:
- src: image1.jpg
  selector: .test
  lazy: true
  placeholder: lqip/dominant/color code
  lqip:
    blur: 5
    div: 5

publish?
