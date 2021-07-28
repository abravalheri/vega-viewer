import attr from './attr.js';

const TEMPLATE = '<div id="vega-embed"></div>';

export class VegaViewer extends HTMLElement {
  @attr spec?: string;

  @attr data?: string;

  @attr embedOptions?: string;

  @attr remoteControl?: string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _createContents() {
    let el = this.querySelector('template:not([slot])');
    if (el == null) {
      el = document.createElement('template');
      el.innerHTML = TEMPLATE;
    }
    return (el as HTMLTemplateElement).content.cloneNode(true);
  }

  render() {
    const contents = this._createContents();
    this.shadowRoot!.append(contents);
  }
}
