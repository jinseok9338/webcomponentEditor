type TemplateStringsArray = string[];
type Substitutions = (string | number)[];

/**
 * A simple `html` template literal function for interpolating variables
 * in a string template.
 *
 * @param strings - Array of string literals.
 * @param substitutions - Values to be interpolated into the template.
 * @returns A string with interpolated values.
 */
export function html(
  strings: TemplateStringsArray,
  ...substitutions: Substitutions
): string {
  // Ensure `strings` is treated as an array of strings
  return strings.reduce((result, stringPart, i) => {
    // Handle the case where there are no substitutions
    return result + stringPart + (substitutions[i] || "");
  }, "");
}

// append to the head
export function css(elementName: string, styles: string) {
  const styleElement = document.createElement("style");
  const customStyles = `
    ${elementName} {
      ${styles}
    }
  `;
  styleElement.innerHTML = customStyles;
  document.head.appendChild(styleElement);
}
