import { expect } from '@open-wc/testing';

import { dasherize, property } from '../src/property.js';

describe('dasherize', () => {
  it('splits on capitals and join the lowercase version with dashes', () => {
    expect(dasherize('VegaViewer')).to.equal('vega-viewer');
    expect(dasherize('vegaViewer')).to.equal('vega-viewer');
    expect(dasherize('vegaViewerMoreWords')).to.equal('vega-viewer-more-words');
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
