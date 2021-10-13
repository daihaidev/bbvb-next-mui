import * as colors from '@material-ui/core/colors'
import { Palette } from '@material-ui/core/styles/createPalette'

const white = '#FFFFFF'
const black = '#000000'

export interface AdditionalPaletteOptions {
  icon: string
  border: {
    main: string
    secondary: string
  }
  chart: {
    red: string
    yellow: string
    orange: string
    green: string
    blue: string
    darkGreen: string
    lightBlue: string
  }
}

const palette: Partial<Palette> = {
  primary: {
    contrastText: white,
    dark: '#b34e40',
    main: '#0062ff',
    light: '#d16b3b',
  },
  secondary: {
    contrastText: '#202020',
    dark: '#b0b0b0',
    main: '#69f0ae',
    light: '#d8d8d8',
  },
  success: {
    contrastText: white,
    dark: '#4caf50',
    main: '#69f0ae',
    light: colors.green[50],
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: '#f5373b',
    light: colors.red[400],
  },
  text: {
    primary: '#263238',
    secondary: '#607d8b',
    tertiary: '#90a4ae',
    disabled: '#939393',
    contrast: '#fbf6eb',
    light: '#78909c',
    description: '#999291',
    hint: '#546e7a',
  },
  icon: colors.grey[400],
  background: {
    default: white,
    primary: '#faf7f2',
    secondary: '#f4ead9',
    tertiary: '#f3efe8',
    paper: white,
    dark: '#212121',
    lightGrey: '#fafafa',
  },
  border: {
    main: '#e5e4e4',
    secondary: '#eeeeee',
  },
  divider: '#f4f3f3',
  chart: {
    red: '#ef5350',
    yellow: '#ffc542',
    orange: '#ff974a',
    green: '#3dd598',
    blue: '#0062ff',
    darkGreen: '#26a69a',
    lightBlue: '#00bcd4',
  },
}

export default palette
