import { fixture, expect, html } from '@open-wc/testing';

import { VegaViewer } from '../src/VegaViewer.js';
import '../vega-viewer.js';

describe('VegaViewer', () => {
  it('has null properties by default', async () => {
    const el: VegaViewer = await fixture(html`<vega-viewer></vega-viewer>`);
    expect(el.spec).to.not.exist;
    expect(el.data).to.not.exist;
    expect(el.stream).to.not.exist;
  });
});
