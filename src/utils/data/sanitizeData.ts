import { omitDeep, replaceDeep } from '../objects'
/**
 * Creates a new data object with sanitized data
 * Sanitizes data by omit __typename properties and replacing '' with null
 * @param data object
 */
const sanitizeData = (data: object) => {
  const replacements = new Map()
  replacements.set('', null) // replace empty string with null
  return replaceDeep(omitDeep(data, ['__typename']), replacements)
}

export default sanitizeData
