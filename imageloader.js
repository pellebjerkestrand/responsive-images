/*
 * Responsive images based on the image area's size, not viewport width.
 * Images must have the data attributes "image-active" and "image-sources".
 * The attributes are filled with a string that describe the url(s) and width(s) of the image(s):
 *
 * Example:
 * <img src="imageulr.jpg"
 *	data-image-active="imageurl.jpg 160"
 *	data-image-sources="imageurl.jpg 160, imageurl_l.jpg 320" />
 */
define(['modules/debounce'], function(debounce){
	var selectors = {
			images: '[data-image-sources][data-image-active]'
		},
		dpr = window.devicePixelRatio || 1;
	
	function getRatio(imageWidth, containerWidth){
		return imageWidth / (containerWidth * dpr);
	}
	
	function getBestImage(images, containerWidth){
		var count = images.length,
			bestImage = images[0],
			bestImageRatio = getRatio(bestImage.width, containerWidth),
			largestImage = images[0],
			largestImageRatio = getRatio(largestImage.width, containerWidth);
		
		for(var i = 1; i < count; i++){
			var currentImage = images[i],
				currentImageRatio = getRatio(currentImage.width, containerWidth);
				
			if(bestImageRatio >= 1){
				break;
			}
			
			if(currentImageRatio > largestImageRatio){
				largestImage = currentImage;
				largestImageRatio = currentImageRatio;
			}
			
			if(currentImageRatio >= 1 && currentImageRatio > bestImageRatio){
				bestImage = currentImage;
				bestImageRatio = getRatio(currentImage.width, containerWidth);
			}
		}
		
		if(largestImageRatio > bestImageRatio && largestImageRatio < 1){
			bestImage = largestImage;
		}
		
		return bestImage;
	}
	
	function tryJsonParse(possiblyJson){
		try {
			return JSON.parse(possiblyJson);
		} catch (e) {
			return false;
		}
	}
	
	function imageFromString(str){
		var image = str.trim().split(' ');
		
		return {
			url: image[0],
			width: parseInt(image[1])
		};
	}
	
	function stringFromImage(image){
		return image.url + ' ' + image.width;
	}
	
	function getImagesFromNode(node){
		var data = node.dataset.imageSources,
			strings = data.split(','),
			images = [],
			l = strings.length;
						
		for(var i = 0; i < l; i++){
			images.push(imageFromString(strings[i]));
		}
		
		return images;
	}
	
	function loadAppropriateImage(imgNode){
		var images = getImagesFromNode(imgNode),
			activeImage = imageFromString(imgNode.dataset.imageActive);
			
		if(!images || images.length === 0 || !activeImage) {
			return;
		}
		
		var bestImage = getBestImage(images, imgNode.scrollWidth);
		
		if(activeImage.width < bestImage.width){
			imgNode.dataset.imageActive = stringFromImage(bestImage);
			imgNode.setAttribute('src', bestImage.url);
		}
	}
	
	function load(){
		var images = document.querySelectorAll(selectors.images),
			count = images.length;
		
		for(var i = 0; i < count; i++){
			loadAppropriateImage(images[i]);
		}
	}
	
	function activate(){
		setTimeout(load, 100);
		window.addEventListener('resize', debounce(load, 250));
	}
	
	return {
		activate: activate,
		loadimages: load
	};
});