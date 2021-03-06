import { fixture, expect, html, nextFrame } from '@open-wc/testing';
import * as params from '../src/params.js';

describe('params', () => {
  describe('spec', () => {
    it('can be a HTML attribute', async () => {
      const spec =
        'https://github.com/vega/vega-lite/raw/master/examples/specs/repeat_splom_cars.vl.json';
      const tag = html`<vega-viewer spec="${spec}" data-test="3"></vega-viwer>`;
      const el: HTMLElement = await fixture(tag);
      expect(params.spec(el)).to.equal(spec);
    });

    it('can be a nested script tag', async () => {
      const tag = html`
        <vega-viewer>
          <script data-vega-spec>
            {
              "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
              "data": {"name": "points"},
              "mark": "point",
              "encoding": {
                "x": {"field": "x", "type": "quantitative"},
                "y": {"field": "y", "type": "quantitative"}
              }
            }
          </script>
        </vega-viwer>
      `;
      const el: HTMLElement = await fixture(tag);
      expect(params.spec(el)).to.include({ mark: 'point' });
    });
  });

  describe('data', () => {
    it('can be a nested script tag', async () => {
      const tag = html`
        <vega-viewer>
          <script data-values type="application/json">
            [
              {"x": 0, "y": 0},
              {"x": 1, "y": 2},
              {"x": 2, "y": 4},
              {"x": 3, "y": 9}
            ]
          </script>
        </vega-viwer>
      `;
      const el: HTMLElement = await fixture(tag);
      const data = await params.data(el);
      expect(data.values.length).to.equal(4);
      expect(data.values.pop()).to.include({ x: 3, y: 9 });
    });

    it('can be a csv', async () => {
      const tag = html`
        <vega-viewer>
          <script data-values type="text/csv">
            x,y
            0,0
            1,2
            2,4
            3,9
          </script>
        </vega-viwer>
      `;
      const el: HTMLElement = await fixture(tag);
      const data = await params.data(el);
      expect(data.values.length).to.equal(4);
      expect(data.values.pop()).to.include({ x: 3, y: 9 });
    });

    it('can be a tsv', async () => {
      const tag = html`
        <vega-viewer>
          <script data-values type="text/tsv">
            x\ty
            0\t0
            1\t2
            2\t4
            3\t9
          </script>
        </vega-viwer>
      `;
      const el: HTMLElement = await fixture(tag);
      const data = await params.data(el);
      expect(data.values.length).to.equal(4);
      expect(data.values.pop()).to.include({ x: 3, y: 9 });
    });

    it('can be a downloadable URL', async () => {
      const url =
        'https://cdn.jsdelivr.net/npm/vega-datasets@2.2.0/data/unemployment.tsv';
      const tag = html`<vega-viewer data="${url}"></vega-viewer>`;
      const el: HTMLElement = await fixture(tag);
      const data = await params.data(el);
      expect(data.values.length).to.at.least(3000);
      expect(data.values[0]).to.include({ id: 1001, rate: 0.097 });
    });
  });

  describe('options', () => {
    it('can be given by a JSON', async () => {
      const tag = html`
        <vega-viewer>
          <script data-embed-options>
            { "theme": "quartz", "actions": false }
          </script>
        </vega-viewer>
      `;
      const el: HTMLElement = await fixture(tag);
      const options = params.options(el);
      expect(options).to.include({ theme: 'quartz' });
      expect(options.actions).to.equal(false);
    });

    it('can be given by a function', async () => {
      const el = document.createElement('vega-viewer');
      const script = document.createElement('script');
      script.setAttribute('data-embed-options', 'getOptions');
      script.innerHTML = `
        function getOptions() {
          return {
            "theme": "quartz",
            "actions": false,
            "fn": function() {
              return 42;
            }
          };
        }
      `;
      el.append(script);
      document.body.append(el);
      await nextFrame();
      const options = params.options(el);
      expect(options).to.include({ theme: 'quartz' });
      expect(options.actions).to.equal(false);
      expect(options.fn()).to.equal(42);
    });
  });
});
