/**
 * Creates a new deeply cloned object composed of replaced primitive values
 * @param src any
 * @param replacements {}
 */
const replaceDeep = (src: any, replacements: Map<any, any>) => {
  if (typeof src !== 'object' || src === null) return replacements.has(src) ? replacements.get(src) : src
  if (Array.isArray(src)) return src.map((v) => replaceDeep(v, replacements))
  return Object.entries(src).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: replaceDeep(value, replacements),
    }),
    {}
  )
}

export default replaceDeep
