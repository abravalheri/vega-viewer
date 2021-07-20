import { property } from './property.js';

export class VegaViewer extends HTMLElement {
  @property spec: undefined | string;

  @property data: undefined | string;

  @property embedOptions: undefined | string;

  @property remoteControl: undefined | string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
