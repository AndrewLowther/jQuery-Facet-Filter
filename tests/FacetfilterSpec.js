var facetfilter, element, expect, should, assert;

expect = chai.expect;
should = chai.should();
assert = chai.assert;

element = document.createElement('div');
element.setAttribute('id', 'facetfilter-test');
document.body.appendChild(element);

describe('FacetFilter', function () {
  describe('Initialization', function () {
    facetfilter = $('#facetfilter-test').facetfilter();
    it('Should have initialized facetfilter', function () {
      expect(facetfilter.data('facetfilter') !== void 0).to.equal(true);
    });
    it('Should fail on request without ajax url', function () {
      try {
        facetfilter.data('facetfilter').request();
      } catch(e) {
        expect(e.message).to.equal('You must supply an ajax URL, bailing');
      }
    });
    it('Should succeed when an ajax url is supplied', function () {
      facetfilter.data('facetfilter').settings.ajax_url = 'http://www.google.co.uk';
      try {
        facetfilter.data('facetfilter').settings.onsuccess = function (response) {
          expect(typeof response).to.be.a('string');
        };
      } catch(e) {
        expect(typeof e).to.be('undefined');
      }
    });
    it('Should allow arbitrary facet addition', function () {
      facetfilter.data('facetfilter').addFacet('test', 'test');
      facetfilter.data('facetfilter').settings.active_filters['test'].should.have.property('test');
    });
    it('Should allow arbitrary facet removal', function () {
      facetfilter.data('facetfilter').removeFacet('test');
      expect(facetfilter.data('facetfilter').settings.active_filters['test']).to.equal(void 0);
    });
    it('Should enable serialization of parameters', function () {
      facetfilter.data('facetfilter').addFacet('mocha', 'mocha');
      expect(facetfilter.data('facetfilter').serialize()).to.equal('mocha%5Bmocha%5D=mocha');
    });
  });
});