import { round } from 'lodash'
import { VALUE_TOGGLE_OPTIONS } from '../views/Performance/constants'

export const switchChart = (valueType: string, data: number[], length: number) => {
  return valueType === VALUE_TOGGLE_OPTIONS[0].value ? data : data.map((item) => round(item * 100, 2))
}
