(function($) {
	
	$.facetfilter = function( element, options ) {
		/**
		 * Default plugin settings
		 */
		var settings = {
			"version": "1.0.0", // Current plugin version
			"filters": null, // Selection of filters that can be applied
			"anti_filters": null, // Deselection filters
			"active_filters": {}, // Current object of active filters
			"ajax_url": null, // Ajax request URL
			"url_options": {}, // Extra options to pass to the URL object (ex. is_ajax: 1)
			"onsuccess": null, // Success callback
			"oncomplete": null, // Complete callback
			"onerror": null, // Error callback
			"callback": null, // Generic callback
			"type": "html" // Specify the data type returned
		};
		
		// Set the facet as this
		var facets = this;
		
		// Empty settings for now
		facets.settings = {};
		
		var $element = $(element), // Our dom reference
			element = element; // The actual dom reference
		
		// Set up the plugin options
		var init = function() {
			facets.settings = $.extend({}, settings, options);
			
			$element.on("change", facets.settings.filters, facets.select);
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
				
				if( facets.settings.onsuccess === null ) {
					var onsuccess = function( response, textStatus, jqXHR ) {};
				} else {
					var onsuccess = facets.settings.onsuccess;
				}
				
				if( facets.settings.oncomplete === null ) {
					var oncomplete = function( jqXHR, textStatus ) {};
				} else {
					var oncomplete = facets.settings.oncomplete;
				}
				
				if( facets.settings.onerror === null ) {
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
					dataType: facets.settings.type,
					success: onsuccess,
					complete: oncomplete,
					error: onerror
				});
			}
		};
		
		// Add a facet to the filters
		facets.addFacet = function( facet, value ) {
			if( typeof facets.settings.active_filters[facet] === 'undefined' ) {
				if( value === null ) {
					value = 1;
				}
				
				facets.settings.active_filters[facet] = {};
			}
			facets.settings.active_filters[facet][value] = value;
		};
		
		// Remove facets from the filters
		facets.removeFacet = function( facet, value ) {
			if( value !== null ) {
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
			if( parseInt( $(this).val() ) ) {
				var facet_name = $(this).parent().parent().attr("id");
				facets.addFacet( facet_name, $(this).val() );
			}
			
			if( facets.settings.callback !== null ) {
				facets.settings.callback.apply(facets, ["addFacet"]);
			}
			
			facets.request();
		};
		
		// Deselect a facet
		facets.deselect = function( e ) {
			var facet_name = $(this).attr("name").replace(/\[(.*)\]/, "");
			facets.removeFacet( facet_name, $(this).val() );
			
			if( facets.settings.callback !== null ) {
				facets.settings.callback.apply(facets, ["removeFacet"]);
			}
			
			facets.request();
		}
		
		// URI Encode active facets
		facets.serialize = function( obj, prefix ) {
			var str = [];
			if( obj === undefined ) {
				obj = facets.settings.active_filters;
			}
			for( var p in obj ) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push(typeof v == "object" ? facets.serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
			return str.join("&");
		}
		
		facets.activeFilters = function() {
			return facets.settings.active_filters;
		}
		
		// Call the init private method
		init();
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