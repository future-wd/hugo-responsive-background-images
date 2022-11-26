# Hugo Responsive Background Images

This module generates background images at specified widths and generates CSS with respective breakpoints. There is an option to lazyload. All you need to do is specify the image (page resource) and CSS selector on the page's front matter.

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

n.b if you use `future-wd/hugo-responsive-images`, noscript support relies on `no-js` being hard coded.

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
```

### On page config - Front matter

```yaml
bg-images:
- src: image1.png # page resource relative to the page's markdown file
  selector: .section--hero # css selector to which the background will be applied
  widths: [500, 900, 1200] # optional override
  loading: lazy # or false - optional see lazy load section for requirements
```

#### TODO

v0.04

- sanitize inputs and generate warnings (and error if problem generates an error e.g. no src or selector)

v0.05

- don't generate images wider than actual image.
- if widths removed, generate width equal to image width if image is TOLLERANCE wider than new widest width

v0.06

- add element config of margin for overside image generation.

v0.07

- placeholder type config (lqip, dominant (css with new hugo .Color?), color code (manual entry)) with global default config.

publish?
