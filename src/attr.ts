export function dasherize(str: string) {
  return str.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

export default function attr(target: Element, propertyName: string) {
  // Define a string property linked to an HTML attribute
  const attrName = dasherize(propertyName);

  Object.defineProperty(target, propertyName, {
    get() {
      return this.getAttribute(attrName);
    },

    set(value: null | string) {
      if (value === null) {
        this.removeAttribute(attrName);
      } else {
        this.setAttribute(attrName, value);
      }
    },
  });
}
