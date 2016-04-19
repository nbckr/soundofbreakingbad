/*
Responsive Accordion
Author: marcoarib
License: http://codecanyon.net/licenses/standard
*/

(function($, window, document, undefined) {
	
    $.accordion = function(element, options) {

        var defaults = {
			duration		: 200,
			delay			: 0,
			exclusive		: true,
			onOpen			: function(){},
			onClose			: function(){}
        }

        var plugin = this;

        var $element = $(element),
            element = element,
			items = $element.children(".accordion-item");

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            startAccordion();
			toggle();
        }
		
		var startAccordion = function(){
			$(items).each(function(){
				if($(this).hasClass("active")){
					$(this).children(".accordion-content").show(0);
				}
			});
		}
		
		var toggle = function(){
			$(items).find(".accordion-header").bind("click", function(e){
				if(!$(this).parent(items).hasClass("active")){
					plugin.open($(this).parent(items).index());
				}
				else{
					plugin.close($(this).parent(items).index());
				}
			});
		}
		 
		plugin.open = function(index){
			if(!$(items[index]).hasClass("active")){
				if(plugin.settings.exclusive){
					$(items).find(".accordion-content").slideUp(plugin.settings.duration);
					$(items).removeClass("active");
				}
				$(items[index]).children(".accordion-content").delay(plugin.settings.delay).slideDown(plugin.settings.duration, function(){
					$(items[index]).addClass("active");
				});
				if(options !== undefined){
					plugin.callback("onOpen");
				}
			}
		}
		
		plugin.setDuration = function(duration){
			plugin.settings.duration = duration;
		}
		
		plugin.setExclusive = function(exclusive){
			plugin.settings.exclusive = exclusive;
		}
		
		plugin.setDelay = function(delay){
			plugin.settings.delay = delay;
		} 
		
		plugin.close = function(index){
			$(items[index]).children(".accordion-content").delay(plugin.settings.delay).slideUp(plugin.settings.duration, function(){
				$(items[index]).removeClass("active");
			});
			if(options !== undefined){
				plugin.callback("onClose");
			}
		}
		
		plugin.closeAll = function(){
			$(items).find(".accordion-content").slideUp(plugin.settings.duration);
			$(items).removeClass("active");
		}
		
		plugin.callback = function(func) {
			if (options[func] !== undefined) {
				options[func].call(element);
			}
		}

        plugin.init();

    }

    $.fn.accordion = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('accordion')) {
                var plugin = new $.accordion(this, options);
                $(this).data('accordion', plugin);
            }
        });
    }

})( jQuery, window , document );