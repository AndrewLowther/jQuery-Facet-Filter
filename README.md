# FacetFilter [![Build Status](https://travis-ci.org/AndrewLowther/jQuery-Facet-Filter.png)](https://travis-ci.org/AndrewLowther/jQuery-Facet-Filter.png)

## Installation

Installing via git

    git clone git@github.com:AndrewLowther/jQuery-Facet-Filter.git

Installation via bower

    bower install facetfilter

## Usage

To use the facet filter, assign it to an element, we currently require an ajax URL to be supplied

    var facet_filter = $('body').facetfilter({
        ajax_url: '/action/id'
    });

### Accessing the facet filter object

The facet filter object can be accessed by the data attribute, for example, using the above instantiation example

    facet_filter.data('facetfilter').addFacet('name', 'value')

### Public API Methods

    facetfilter.request(type) // Make an ajax request, type is GET, PUT, POST
    facetfilter.addFacet(facet, value) // Add an arbitrary facet programmatically
    facetfilter.removeFacet(facet, value = null) // Remove an entire facet, or a single facet value
    facetfilter.serialize() // Return a URL encoded string of active filters
    facetfilter.activeFilters() // Return the current list of active filters as an object

## Options

    {
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
    }

