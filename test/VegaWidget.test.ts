import { fixture, expect, html } from '@open-wc/testing';

import { VegaWidget } from '../src/VegaWidget.js';
import '../vega-widget.js';

describe('VegaWidget', () => {
  it('has null properties by default', async () => {
    const el: VegaWidget = await fixture(html`<vega-widget></vega-widget>`);
    expect(el.spec).to.not.exist;
    expect(el.data).to.not.exist;
    expect(el.stream).to.not.exist;
  });
});
