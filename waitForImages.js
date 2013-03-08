//function for executing a callback when all images in the jQuery object are loaded (or fail).
$.fn.waitForImages = function (callback){
	var $images = this.find('img').add(this.filter('img')),
		loaded = [],
		temporary = [];


	if ($images.length < 1){ //no images to wait for, trigger immediately
		setTimeout(callback, 0);
		return;
	}
	
	function loadHandler(event){
		
		//get a reference to the original image that this event is referring to
		var img = $(this).data('originalImage') || this;
	
		if ($.inArray(img, loaded) === -1){
			loaded.push(img);
		}
		
		if (loaded.length >= $images.length){ //all images are done, clean up and schedule the main callback
			
			//remove all added event handlers on original img elements
			$images.unbind('load error', loadHandler);
			
			//remove all added event handlers on temporary img elements 
			for (var i=0; i<temporary.length; i++){
				temporary[i].unbind('load error', loadHandler);
			}
			
			//DONE!!!
			setTimeout(callback, 0);
		}
	}				

	return $images
		.bind('load error', loadHandler)
		.each(function( i, el ){ //triggers the load event on images we already know are done
			
			if (this.complete){ //true in Chrome and FF for loaded and failed images; true in IE for loaded images ONLY
				$(this).load();
			} 
			
			else if (this.readyState){ //special cases for IE
				if (this.src.lastIndexOf('/') === this.src.length - 1){ //src was set to the empty string; IE stores this as the window url without the filename
					$(this).load();
				} else { 
					//hack for getting an event triggered in IE so we can tell whether or not
					//the image failed or if we're still waiting for it. We'll create another img element,
					//attach an event handler to it, and give it the same src. If either the original or this
					//temporary element fire an event, then we'll know what happened and for all purposes can assume the same thing 
					//happened to the other one. Notice that we don't need to add the temporary img element to the DOM.
					var $tempImg = $('<img />');
					temporary.push($tempImg);
					$tempImg.bind('load error', loadHandler);
					$tempImg.data('originalImage', this); //attach a reference to the original element to the temporary one; we'll use this
						//later so we don't double count events
					$tempImg.attr('src', this.src);
				}
			}
		});
}