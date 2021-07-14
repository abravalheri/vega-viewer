export function dasherize(str: string) {
  return str.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

export function property(target: Element, name: string) {
  // Define a string property linked to an HTML attribute
  const attr = dasherize(name);

  Object.defineProperty(target, name, {
    get() {
      return this.getAttribute(attr);
    },

    set(value: null | string) {
      if (value === null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, value);
      }
    }
  });
}
