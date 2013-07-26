;(function ($) {
  'use strict';
  
  $.facetfilter = function( element, options ) {
    var settings, facets, $element, init;

    /**
     * Default plugin settings
     */
    settings = {
      'version': '1.0.2', // Current plugin version
      'filters': null, // Selection of filters that can be applied
      'anti_filters': null, // Deselection filters
      'active_filters': {}, // Current object of active filters
      'single_filters': [], // Define a list of filters that are single use
      'exclude_params': [],
      'ajax_url': null, // Ajax request URL
      'url_options': {}, // Extra options to pass to the URL object (ex. is_ajax: 1)
      'onsuccess': null, // Success callback
      'oncomplete': null, // Complete callback
      'onerror': null, // Error callback
      'callback': null, // Generic callback
      'type': 'html' // Specify the data type returned
    };
    
    // Set the facet as this
    facets = this;
    
    // Empty settings for now
    facets.settings = {};
    
    $element = $(element), // Our dom reference
      element = element; // The actual dom reference
    
    // Set up the plugin options
    init = function() {
      var key, val;

      facets.settings = $.extend({}, settings, options);
      
      $element.on('change', facets.settings.filters, facets.select);
      $element.on('click', facets.settings.anti_filters, facets.deselect);

      for(key in facets.settings.exclude_params) {
        val = facets.settings.exclude_params[key];
        facets.addFacet(val.name, val.val);
      }
    };
    
    // Set up a request
    facets.request = function(type) {
      var key, facet_data;

      if( !facets.settings.ajax_url ) {
        throw new Error('You must supply an ajax URL, bailing');
      } else {
        if( type === void 0 ) {
          type = 'GET';
        } else {
          type = type.toUpperCase();
        }
        
        facet_data = facets.settings.active_filters;
        // Add in options for the ajax request
        for( key in facets.settings.url_options ) {
          facet_data[key] = facets.settings.url_options[key];
        }
        
        $.ajax({
          url: facets.settings.ajax_url,
          type: type,
          data: facet_data,
          dataType: facets.settings.type,
          success: (facets.settings.onsuccess !== void 0 ? facets.settings.onsuccess : function () {}),
          complete: (facets.settings.oncomplete !== void 0 ? facets.settings.oncomplete : function () {}),
          error: (facets.settings.onerror !== void 0 ? facets.settings.onerror : function () {})
        });
      }
    };
    
    // Add a facet to the filters
    facets.addFacet = function(facet, value) {
      if( typeof facets.settings.active_filters[facet] === 'undefined' ) {
        if( value === null ) {
          value = 1;
        }
        
        facets.settings.active_filters[facet] = {};
      }

      if( facets.isSingleFilter(facet) ) {
        facets.settings.active_filters[facet] = value;
      } else {
        facets.settings.active_filters[facet][value] = value;
      }
    };
    
    // Remove facets from the filters
    facets.removeFacet = function(facet, value) {
      var key, facet_count;

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
      facet_count = 0;
      for( key in facets.settings.active_filters[facet] ) {
        facet_count++;
      }
      
      if( facet_count === 0 ) {
        delete facets.settings.active_filters[facet];
      }
      
    };
    
    // Select a facet
    facets.select = function(e) {
      var facet_name;

      facet_name = $(this).parent().parent().attr('id');
      facets.addFacet( facet_name, $(this).val() );
      
      if( facets.settings.callback !== null ) {
        facets.settings.callback.apply(facets, ['addFacet', facet_name, $(this).val()]);
      }
      
      facets.request();
    };
    
    // Deselect a facet
    facets.deselect = function(e) {
      var facet_name;

      facet_name = $(this).attr('name').replace(/\[(.*)\]/, '');
      facets.removeFacet( facet_name, $(this).val() );
      
      if( facets.settings.callback !== null ) {
        facets.settings.callback.apply(facets, ['removeFacet', facet_name]);
      }
      
      facets.request();
    };
    
    // URI Encode active facets
    facets.serialize = function(obj, prefix) {
      var str, p, k, v;

      str = [];
      if( obj === undefined ) {
        obj = facets.settings.active_filters;
      }
      for( p in obj ) {
        k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
        str.push(typeof v == 'object' ? facets.serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
      return str.join('&');
    };

    // Get the index of an array, or add it if it doesn't exist
    facets.isSingleFilter = function(filter) {
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
          if (this === null) {
            throw new TypeError();
          }
          var t = Object(this);
          var len = t.length >>> 0;
          if (len === 0) {
            return -1;
          }
          var n = 0;
          if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
              n = 0;
            } else if (n !== 0 && n != Infinity && n != -Infinity) {
              n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
          }
          if (n >= len) {
            return -1;
          }
          var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
          for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
              return k;
            }
          }
          return -1;
        };
      }

      if( facets.settings.single_filters.indexOf(filter) !== -1 ) {
        return true;
      } else {
        return false;
      }
    };
    
    facets.activeFilters = function() {
      return facets.settings.active_filters;
    };
    
    // Call the init private method
    init();
  };
  
  $.fn.facetfilter = function(options) {
    var facetfilter, ident;

    ident = 'facetfilter';
    return this.each(function() {
      if( undefined === $(this).data(ident) ) {
        facetfilter = new $.facetfilter(this, options);
        
        $(this).data(ident, facetfilter);
      }
    });
  };
  
})(jQuery);