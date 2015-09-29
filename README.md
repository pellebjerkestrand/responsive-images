# Responsive Images
Responsive images based on the image area's size, not viewport width.

Images must have the data attributes "image-active" and "image-sources".
The attributes are filled with a string that describe the url(s) and width(s) of the image(s).

## Example
```<img src="imageurl.jpg"
data-image-active="imageurl.jpg 160"
data-image-sources="imageurl.jpg 160, imageurl_l.jpg 320" />```