import { expect } from '@open-wc/testing';

import { dasherize, property } from '../src/property';


describe('dasherize', () => {
  it('splits on capitals and join the lowercase version with dashes', () => {
    expect(dasherize('VegaWidget')).to.equal('vega-widget');
    expect(dasherize('vegaWidget')).to.equal('vega-widget');
    expect(dasherize('vegaWidgetMoreWords')).to.equal('vega-widget-more-words');
  });
});


describe('property', () => {
  class MyElement extends HTMLElement {
    @property dataCustom: null | String = null;
  }

  window.customElements.define('my-element', MyElement);

  const el = new MyElement();
  expect(el.getAttribute('data-custom')).to.not.exist;
  expect(el.dataCustom).to.not.exist;
  el.dataCustom = '42';
  expect(el.getAttribute('data-custom')).to.equal('42');
  el.setAttribute('data-custom', '13');
  expect(el.dataCustom).to.equal('13');
});
