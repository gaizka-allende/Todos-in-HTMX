import html from '../utils/html'

export default function screen(
  strings: TemplateStringsArray,
  ...values: string[]
) {
  let out = ''
  strings.forEach((string, i) => {
    const value = values[i]

    // Array - Join to string and output with value
    if (Array.isArray(value)) {
      out += string + value.join('')
    }
    // String - Output with value
    else if (typeof value === 'string') {
      out += string + value
    }
    // Number - Coerce to string and output with value
    // This would happen anyway, but for clarity's sake on what's happening here
    else if (typeof value === 'number') {
      out += string + String(value)
    }
    // object, undefined, null, boolean - Don't output a value.
    else {
      out += string
    }
  })
  return html`
    <div
      id="screen"
      class="mt-[50px] lg:mt-[100px] mb-0 mx-auto md:w-[600px] relative"
      hx-ext="response-targets"
    >
      ${out}
    </div>
  `
}
