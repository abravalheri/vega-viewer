import { property } from './property.js';

export class VegaViewer extends HTMLElement {
  @property spec: null | String = null;

  @property data: null | String = null;

  @property stream: null | String = null;

  @property embedOptions: null | String = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
