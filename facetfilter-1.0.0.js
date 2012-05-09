(function($) {
	
	$.facetfilter = function( element, options ) {
		/**
		 * Default plugin settings
		 */
		var settings = {
			"version": "1.0",
			"filters": null,
			"anti_filters": null,
			"active_filters": {},
			"ajax_url": null,
			"url_options": {},
			"onsuccess": null,
			"oncomplete": null,
			"onerror": null
		};
		
		// Set the facet as this
		var facets = this;
		
		// Empty settings for now
		facets.settings = {};
		
		var $element = $(element), // Our dom reference
			element = element; // The actual dom reference
		
		// Set up the plugin options
		facets.init = function() {
			facets.settings = $.extend({}, settings, options);
			
			$element.on("change click", facets.settings.filters, facets.select);
			$element.on("click", facets.settings.anti_filters, facets.deselect)
		};
		
		// Set up a request
		facets.request = function( type ) {
			if( !facets.settings.ajax_url ) {
				throw new Error("You must supply an ajax URL, bailing");
			} else {
				if( type === void 0 ) {
					type = "GET";
				} else {
					type = type.toUpperCase();
				}
				
				if( facets.settings.onsuccess === void 0 ) {
					var onsuccess = function( response, textStatus, jqXHR ) {};
				} else {
					var onsuccess = facets.settings.onsuccess;
				}
				
				if( facets.settings.oncomplete === void 0 ) {
					var oncomplete = function( jqXHR, textStatus ) {};
				} else {
					var oncomplete = facets.settings.oncomplete;
				}
				
				if( facets.settings.onerror === void 0 ) {
					var onerror = function( jqXHR, textStatus, errorThrown ) {};
				} else {
					var onerror = facets.settings.onerror;
				}
				
				var key, facet_data = facets.settings.active_filters;
				// Add in options for the ajax request
				for( key in facets.settings.url_options ) {
					facet_data[key] = facets.settings.url_options[key];
				}
				
				$.ajax({
					url: facets.settings.ajax_url,
					type: type,
					data: facet_data,
					dataType: "html",
					success: onsuccess,
					complete: oncomplete,
					error: onerror
				});
			}
		};
		
		// Add a facet to the filters
		facets.addFacet = function( facet, value ) {
			if( typeof facets.settings.active_filters[facet] === 'undefined' ) {
				if( value === void 0 ) {
					value = 1;
				}
				
				facets.settings.active_filters[facet] = {};
			}
			facets.settings.active_filters[facet][value] = value;
		};
		
		// Remove facets from the filters
		facets.removeFacet = function( facet, value ) {
			if( value !== void 0 ) {
				if( typeof facets.settings.active_filters[facet][value] !== 'undefined' ) {
					delete facets.settings.active_filters[facet][value];
				}
			} else {
				if( typeof facets.settings.active_filters[facet] !== 'undefined' ) {
					delete facets.settings.active_filters[facet];
				}
			}
			
			// Check if there are no more facets in the list, remove it completely from the active facets
			var key, facet_count = 0;
			for( key in facets.settings.active_filters[facet] ) {
				facet_count++;
			}
			
			if( facet_count === 0 ) {
				delete facets.settings.active_filters[facet];
			}
			
		};
		
		// Select a facet
		facets.select = function( e ) {
			// This is currently a bit of a hack for the projects I'm currently working on, feel free to change/fix this as needed
			var facet_name = $(this).parent().parent().attr("id");
			facets.addFacet( facet_name, $(this).val() );
			
			facets.request();
		};
		
		// Deselect a facet
		facets.deselect = function( e ) {
			var facet_name = $(this).attr("name").replace(/\[(.*)\]/, "");
			facets.removeFacet( facet_name, $(this).val() );
			
			facets.request();
		}
		
		facets.init();
	}
	
	$.fn.facetfilter = function( options ) {
		return this.each(function() {
			if( undefined === $(this).data('facetfilter') ) {
				var facetfilter = new $.facetfilter(this, options);
				
				$(this).data("facetfilter", facetfilter);
			}
		});
	}
	
})(jQuery);