import { fixture, expect, html } from '@open-wc/testing';

import { VegaViewer } from '../src/VegaViewer.js';
import '../vega-viewer.js';

describe('VegaViewer', () => {
  it('has null properties by default', async () => {
    const el: VegaViewer = await fixture(html`<vega-viewer></vega-viewer>`);
    expect(el.spec).to.not.exist;
    expect(el.data).to.not.exist;
    expect(el.remoteControl).to.not.exist;
  });

  it('can have properties reflecting HTML attributes', async () => {
    const spec =
      'https://github.com/vega/vega-lite/raw/master/examples/specs/repeat_splom_cars.vl.json';
    const data =
      'https://cdn.jsdelivr.net/npm/vega-datasets@2.2.0/data/cars.json';
    const tag = html`<vega-viewer spec="${spec}" data="${data}"></vega-viwer>`;
    const el: VegaViewer = await fixture(tag);
    expect(el.spec).to.equal(spec);
    expect(el.data).to.equal(data);
  });
});

describe('render', () => {
  it('creates a div#vega-embed element', async () => {
    const el: VegaViewer = await fixture(html`<vega-viewer></vega-viewer>`);
    el.render();
    expect(el.shadowRoot!.querySelector('#vega-embed')).to.exist;
  });

  it('also accepts a custom template', async () => {
    const el: VegaViewer = await fixture(html`
      <vega-viewer>
        <template>
          <div id="vega-embed"></div>
          <footer>custom template</footer>
        </template>
      </vega-viewer>
    `);
    el.render();
    const footer = el.shadowRoot!.querySelector('footer');
    expect(footer).to.exist;
    expect(footer!.innerHTML).to.contain('custom template');
  });
});
