// Private module for finding parameters

import * as vega from 'vega';

// The following interface is required because TypeScript does not
// understang that Array.includes can accept any type of argument
declare global {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ReadonlyArray<T> {
    includes<S, R extends `${Extract<S, string>}`>(
      this: ReadonlyArray<R>,
      searchElement: S,
      fromIndex?: number
    ): searchElement is R & S;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

const VALID_FORMATS = ['topojson', 'json', 'csv', 'tsv'] as const;
type Format = typeof VALID_FORMATS[number];

export function ensureChildScript(
  viewer: HTMLElement,
  dataAttr: string,
  paramName: string
): HTMLScriptElement {
  const child: null | HTMLScriptElement = viewer.querySelector(
    `script[${dataAttr}]`
  );
  if (!child) {
    let msg = `No value defined for "${paramName}". `;
    msg += `You can fix this by defining <script ${dataAttr}>.`;
    throw Error(msg);
  }
  return child;
}

export function formatFromRoot(viewer: HTMLElement): null | string {
  if (viewer.dataset.format) return viewer.dataset.format;

  if (!viewer.hasAttribute('data')) return null;

  const dataAttr = viewer.getAttribute('data')!;
  const format = dataAttr.split('.').slice(-1).pop();
  if (format && VALID_FORMATS.includes(format)) return format;

  return null;
}

export function formatFromScript(script: HTMLScriptElement): null | string {
  if (script.dataset.format) return script.dataset.format;
  if (script.hasAttribute('type'))
    return script.getAttribute('type')!.split('/').pop()!;
  return null;
}

export function paramFromScript(
  script: HTMLScriptElement,
  dataAttr: string
): any {
  const name = script.getAttribute(dataAttr);
  if (name) {
    const fn = vega.field(name)(window);
    return fn();
  }

  return script.textContent!;
}

export function unindent(str: string): string {
  return str
    .trim()
    .split(/[\r\n]+/)
    .map(s => s.trim())
    .join('\n');
}

export function spec(viewer: HTMLElement) {
  // Consider both the `spec` HTML attribute and the content of nested script elements
  if (viewer.hasAttribute('spec')) {
    return viewer.getAttribute('spec')!;
  }
  const child = ensureChildScript(viewer, 'data-vega-spec', 'spec');
  return JSON.parse(paramFromScript(child, 'data-vega-spec'));
}

export async function data(viewer: HTMLElement) {
  // Consider both the `data` HTML attribute and the content of nested script elements
  let values: string | any;
  let format: undefined | null | string;
  let name: undefined | string;

  if (viewer.hasAttribute('data')) {
    const response = await fetch(viewer.getAttribute('data')!);
    values = await response.text();
    format = formatFromRoot(viewer);
    name = viewer.dataset.name;
  } else {
    const child = ensureChildScript(viewer, 'data-values', 'data');
    values = paramFromScript(child, 'data-values');
    format = formatFromScript(child);
    name = child.dataset.name;

    if (format && !format.includes('json')) values = unindent(values); // vega.read does not recognise indented C|TSV
  }

  if (vega.isString(values))
    values = vega.read(values, { type: format as Format, parse: 'auto' });

  return { name, values };
}

export function options(viewer: HTMLElement) {
  const child: null | HTMLScriptElement = viewer.querySelector(
    'script[data-embed-options]'
  );
  if (!child) return {};
  let value = paramFromScript(child!, 'data-embed-options');
  if (vega.isString(value)) value = JSON.parse(value);
  return value;
}
