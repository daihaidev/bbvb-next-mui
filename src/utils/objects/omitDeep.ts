/**
 * Creates a new deeply cloned object composed of non-omitted properties
 * @param src any
 * @param keys string[]
 */
const omitDeep = (src: any, keys: string[]) => {
  if (typeof src !== 'object' || src === null) return src
  if (Array.isArray(src)) return src.map((v) => omitDeep(v, keys))
  return Object.entries(src).reduce((obj, [key, value]) => {
    if (keys.includes(key)) return obj
    return {
      ...obj,
      [key]: omitDeep(value, keys),
    }
  }, {})
}

export default omitDeep
