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
    lazy: true # optional see lazy load section for requirements (still experimental)
    placeholder: lqip/dominant/css color code # optional
    lqip: # optional override 
      div: 4
      blur: 5
    widths: [500, 900, 1200] # optional override
```

### On page config, per width (in development)

```yaml
bg-images:
  widths: [...]
  root_margin:
  ... 
  images:
  - src: image1.png
    selector: .section--hero
    widths:
    - width: 500
      fit_ratio: [9, 16] # vertical mobile ratio
    - width: 900
    - width: 1200
```

| Name                   | Site | Page | Image | Width | Description                        | Default |
| ---------------------- | ---- | ---- | ----- | ----  | ---------------------------------- | ------- |
| src                    | NO   | NO   | YES   | NO    | Image path                      | (required) |
| selector               | NO   | NO   | YES   | NO    | CSS selector for bg-image       | (required) |
| root_margin            | YES  | NO   | NO    | NO    | Pixels below page to load bg-img   | `25`    |
| suppress_width_warning | YES  | NO   | NO    | NO    | Suppress warning for narrow images | `false` |
| min_width_difference   | YES  | YES  | YES   | NO    | If widths are too large for image,minimum width between a defined width and the image width for the image width to be used as resize width | `30`  |
| lazy                   | YES  | YES  | YES   | NO    | Enable lazy loading               | `false`  |
| placeholder            | YES  | YES  | YES   | NO    | Placeholder type                  | `false`  |

to add:
  "blur" .lqip.blur
  "div" .lqip.div
  "quality" .lqip.quality

### Image processing params

| Name             | Site | Page | Image | Width | Description                            | Default |
| ---------------- | ---- | ---- | ----- | ----  | -------------------------------------- | ------- |
| fill_ratio (dev) | YES  | YES  | YES   | YES   | Ratio for fill resize (slice W,H)      | `null`  |
| quality          | YES  | YES  | YES   | YES   | Image resize quality (int)             | `75` *  |
| rotate           | YES  | YES  | YES   | YES   | Counter clockwise rotation (int)       | `null`  |
| resample_filter  | YES  | YES  | YES   | YES   | Filter for resize (string)             | `null`  |
| hint             | YES  | YES  | YES   | YES   | Hint for webp conversion (string)      | `null`  |
| anchor           | YES  | YES  | YES   | YES   | Smart crop anchor point (string)       | `null`  |
| background_color | YES  | YES  | YES   | YES   | BG color if transparency not supported | `null`  |

* `quality` default of 75 will override your hugo image processing defaults, but is necessary to keep files sizes down.

Available params:

- all image processing options
- fit_ratio

### Change log

v0.04

- don't generate images wider than actual image.
- if widths removed, generate width equal to image width if image is TOLERANCE wider than new widest width
- markdown parameters are sanitized with error messages
- placeholder option of lqip/dominant/color code

v0.0.5

- moved common utils to github.com/future-wd/hugo-imaging-common
- level based sanitization and error messages
- hugo image processing options added
- only resize to 1x1 for .Color once! not at every width
- js params moved to js partial
- sanitize.html customize error message for site/page/image level config
- change .resize.original and .resize.jpg to .resize.fallback and add np_jpg configuration to disable jpg conversion
- rename $not_lazy_selectors to $eager_selectors
- move lqip generation to partial (Still experimental due to large blur image files)
- restrict-widths (local file for now) accepts slice of widths, or slice of maps which includes widths
- option of fit_ratio to avoid wide images for narrow screens
- params can be added at a width level

#### TODO

v0.0.5
- update readme to reflect new widths structure and check other params
- check for caching issues and use partialCached
- should there be a disable_lazy site param to override? or does lazyload degrade gracefully if not js class?
- placeholder generation - check current setup (no blur config, no size config, no crop compensation yet)
- test dominant
- test sanitization at different levels
- use resources.Copy to rename lqip image resource for easy debug in browser. check how lqip is handled in responsive-images
- option for publish scss rather than compile to css and gen .RelPermalink with .Publish
- option for publish js with .Publish
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
- fix up lqip as currently too big with blur applied
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
