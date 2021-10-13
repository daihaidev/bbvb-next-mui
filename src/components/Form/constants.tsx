import orderBy from 'lodash/orderBy'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import FaceIcon from '@material-ui/icons/Face'
import MoodBadIcon from '@material-ui/icons/MoodBad'

// TODO: Replace icons with assets
export const RATE_OPTIONS = [
  { icon: MoodBadIcon, value: 1 },
  { icon: SentimentDissatisfiedIcon, value: 2 },
  { icon: FaceIcon, value: 3 },
  { icon: SentimentSatisfiedIcon, value: 4 },
  { icon: SentimentVerySatisfiedIcon, value: 5 },
]

export const MIN_RATE_VALUE = orderBy(RATE_OPTIONS, ['value'], ['asc'])[0].value
export const MAX_RATE_VALUE = orderBy(RATE_OPTIONS, ['value'], ['desc'])[0].value

export const INITIAL_RATE_VALUE = MIN_RATE_VALUE - 1
export const INITIAL_SELECT_VALUE = ''
export const INITIAL_RADIO_VALUE = ''
