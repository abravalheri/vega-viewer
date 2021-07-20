/* eslint-disable no-param-reassign */
import { fixture, expect, html } from '@open-wc/testing';

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
    @property myattr: undefined | String;

    @property dataMyattr: undefined | String;
  }

  window.customElements.define('my-element', MyElement);

  function testReflection(el: MyElement) {
    el.myattr = '42';
    expect(el.getAttribute('myattr')).to.equal('42');
    el.setAttribute('myattr', '13');
    expect(el.myattr).to.equal('13');
  }

  function testReflectionWithDasherization(el: MyElement) {
    expect(el.getAttribute('data-myattr')).to.not.exist;
    expect(el.dataMyattr).to.not.exist;
    el.dataMyattr = '42';
    expect(el.getAttribute('data-myattr')).to.equal('42');
    el.setAttribute('data-myattr', '13');
    expect(el.dataMyattr).to.equal('13');
    el.removeAttribute('data-myattr');
    expect(el.dataMyattr).to.not.exist;
  }

  describe('when used with constructor', () => {
    it('should reflect attributes correctly', () => {
      const el = new MyElement();
      testReflection(el);
      testReflectionWithDasherization(el);
    });
  });

  describe('when used in the DOM', () => {
    it('should reflect attributes correctly', async () => {
      const tag = html`<my-element myattr="value"></my-element>`;
      const el: MyElement = await fixture(tag);
      expect(el.myattr).to.equal('value');
      testReflection(el);
      testReflectionWithDasherization(el);
    });
  });
});
