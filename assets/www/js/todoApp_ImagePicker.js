(function($){

	// --------- Component Interface Implementation --------- //
	function todoApp_ImagePicker(){};
	
	todoApp_ImagePicker.prototype.create = function(data){
		var $e = $(Handlebars.compile($("#tmpl-todoApp_ImagePicker").html())());
		
		return $e;		
	};

    todoApp_ImagePicker.prototype.init = function (data, config) {
        var c = this;
        var $e = c.$element;

		c.imageSrcListeners = [];

        if (data && data.image){
        	c.image = data.image;
        }
        if (data && data.width){
        	c.width = data.width;
        	c.height = data.height;
        	c.isValid = true;
        }
        
        // if we have the image, we show it. 

    };

    todoApp_ImagePicker.prototype.postDisplay = function (data, config) {
        var c = this;
        var $e = c.$element;
        
		c.$imagePreview = $e.find(".image-preview");
		c.$imageSelector = $e.find(".image-selector");
		c.$imageLocal = $e.find(".image-local");
		c.$imageUrl = $e.find(".image-url");
		
		c.$imgSaved = $e.find("img.savedImage");
		c.$imgPicked = $e.find("img.pickedImage");
		c.$imgHidden = $e.find("img.hiddenImage");

		// ------ Show the Image section/preview --------- //
		if (data && data.image) {
        	showPreview.call(c);	
        	hideSelector.call(c);
        }else{
        	storeSection = getStoreSection.call(c);
        	showStoreSection.call(c,storeSection,true);
        }
		// ------ /Show the Image section/preview --------- //
		
		// when the user change the URL
		$e.on("blur","input[name='url']",function(){
			var $inputUrl = $(this);
			var url = $inputUrl.val();
			$e.find("input[name='upload']").val(null);	
			showPickedImage.call(c,url);
		});
		
		
		// when the user select a local file
		$e.on("change","input[name='upload']",function(){
			var $inputUpload = $(this);
		   if (this.files && this.files.length > 0){
			   $e.find("input[name='url']").val("");
		       var file = this.files[0];
		       var reader = new FileReader();
		       reader.onload = function(e) {
		       		var url = e.target.result;
		       		if (c.isValid) {
		       			$e.find(".validation-message").remove();
		       			c.$imgHidden.attr("src",url);
		       			c.$imgHidden.bind("load",function(){
		       				if (c.width + "px" == c.$imgHidden.css("width") && c.height + "px" == c.$imgHidden.css("height")) {
		       					showPickedImage.call(c,url);
		       				}else{
		       					c.$imgHidden.closest(".todoApp_ImagePicker").find(".validation-message").remove();
								c.$imgHidden.before("<div class='validation-message'>Image size should be " + c.width + "*" + c.height + ",now it is " + c.$imgHidden.css("width") + "*"
										+ c.$imgHidden.css("height") + "</div>");
								c.$imgHidden.closest(".todoApp_ImagePicker").find("form")[0].reset();
		       				}
		       			})
		       		}else{
						showPickedImage.call(c,url);
					}		       		
		       }
		       reader.readAsDataURL(file);
		   }			
		});
		
		$e.on("click",".change-image",function(){
			var $changeImage = $(this);
			showSelector.call(c);
			$changeImage.hide();
			$e.find(".image-preview .cancel-change-image").show();
		});
		
		$e.on("click",".cancel-change-image",function(){
			var $cancelChangeImage = $(this);
			if (c.image){
				hideSelector.call(c);
			}
			//make sure to empty the input
			$e.find("input[name='url']").val("");
			$e.find("input[name='upload']").val(null);				
			$cancelChangeImage.hide();
			if (c.image){
				$e.find(".image-preview .change-image").show();
			}
			showSavedImage.call(c);
		});
		

        $e.delegate("input[name='storeType']", "change", function (){
            var $input = $(this);
            var storeType = $input.val();
             
            showStoreSection.call(c,storeType); 
        });

    };

	// --------- /Component Interface Implementation --------- //
	
	// --------- Component Private Methods --------- //
    
    
	todoApp_ImagePicker.prototype.validate = function() {
		var c = this;
		var $e = c.$element;

		var storeType = getStoreSection.call(c);
		
		if(storeType) {
			var $urlInput = $e.find("input[name='url']"); 
			var url = $urlInput.val();
			if(url) {
				if(!url.isUrl()) {
					$urlInput.after("<div class='validation-message'>must be a valid image url</div>");
					return false;
				} else {
					$e.find(".validation-message").remove();
					return true;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	};
	
	todoApp_ImagePicker.prototype.getCurrentImageSrc = function(){
		var c = this;
		if (this.currentImageSrc){
			return this.currentImageSrc;
		}else{
			return getImageSrc(c.image);
		} 
	}
	
	// add an imageSrcChange listener
	todoApp_ImagePicker.prototype.imageSrcChange = function(listener) {
		this.imageSrcListeners.push(listener);
	};

	// return the image object
	todoApp_ImagePicker.prototype.getImage = function() {
		var c = this;
		var $e = c.$element;
		
		var image = {};
		
		var storeType = getStoreSection.call(c);
		
		if(storeType == "url") {
			image.url = $e.find("input[name='url']").val();
		} else {
			var files = $e.find("input[name='upload']").get(0).files;
			if(files && files.length > 0) {
				image.file = files[0];
			}
		}
		
		return image;
	};
	
	// called to show the saved image
	function showSavedImage(){
		var c = this;
		
		c.currentImageSrc = null;
		
		c.$imgSaved.show();
		c.$imgPicked.hide();
		
	}
	
	// called when the user picked an image
	function showPickedImage(newImageSrc){
		var c = this;
		
		if (newImageSrc){
			c.currentImageSrc = newImageSrc;
		}else{
			c.currentImageSrc = null;
		}
		
		c.$imgSaved.hide();
		c.$imgPicked.attr("src",newImageSrc).show();
		
		showPreview.call(c);
		triggerImageSrcChange.call(c,newImageSrc);
	}
	
	
	function triggerImageSrcChange(newImageSrc){
		c = this; 
		
		$.each(this.imageSrcListeners,function(idx,listener){
			listener(newImageSrc);
		});		
	}
	
	function showPreview(){
		var c = this; 
		var $e = c.$element;
		c.$imagePreview.show();
		
		if (c.image){
			var src = getImageSrc(c.image);
			c.$imgSaved.attr("src",src);
			c.$imgSaved.attr("title",src);
		}else{
			// if there are no current image, toggle the change image button
			$e.find(".image-preview .change-image").hide();
			$e.find(".image-preview .cancel-change-image").show();
		}
		
	}
	
	function hideSelector(){
		var c = this; 
		var $e = c.$element;
				
		c.$imageSelector.hide();
		
		// remove the src of the eventual img tag in the url selector
		c.$imgSaved.show();
		
		c.$imgPicked.hide();
	}
	
		
	function showSelector(){
		var c = this; 
		var $e = c.$element;
				
		c.$imageSelector.show();	
		
		var storeType = getStoreSection.call(c);
		showStoreSection.call(c,storeType);	
	}
	
	// return the storeSection from the radio button. "url" or "local"
	function getStoreSection(){
		var c = this;
		var $e = c.$element;

		return $e.find("input[name='storeType']:checked").val();		
	}
	
	function showStoreSection(storeType,immediate){
		var c = this;
		var $e = c.$element;
		
		var speed = (immediate)?null:"fast";
		
		var $localInput = $e.find(".image-local-inputSection");
		var $urlInput = $e.find(".image-url-inputSection");
		if (storeType == "url"){
			c.$imageLocal.removeClass("sel");
			c.$imageUrl.addClass("sel");
			$localInput.hide(speed);
			$urlInput.show(speed);
		}else{
			c.$imageLocal.addClass("sel");
			c.$imageUrl.removeClass("sel");			
			$localInput.show(speed);
			$urlInput.hide(speed);
		}
			
	}
	
	getImageSrc = function(image){
		var path = null;
		if (image){
			if (image.type === "local"){
				path = image.src
			}else{
				path = image.url;
			}
		}
		
		return path; 		
	}

	// --------- /Component Private Methods --------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_ImagePicker", {
		emptyParent : true,
		loadTemplate:true
	}, function() {
		return new todoApp_ImagePicker();
	});
	// --------- /Component Registration --------- //
})(jQuery);