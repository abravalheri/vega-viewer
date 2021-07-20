import attr from './attr.js';

export class VegaViewer extends HTMLElement {
  @attr spec: undefined | string;

  @attr data: undefined | string;

  @attr embedOptions: undefined | string;

  @attr remoteControl: undefined | string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
