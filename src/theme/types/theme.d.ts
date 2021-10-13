import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { AdditionalPaletteOptions } from '../palette'

/**
 * Add custom properties to MUITheme
 * @link https://material-ui.com/guides/typescript/#customization-of-theme
 */

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sectionWrapper?: any
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {}
}

declare module '@material-ui/core/styles/createPalette' {
  interface Palette extends AdditionalPaletteOptions {}

  interface TypeText {
    primary: string
    secondary: string
    tertiary: string
    contrast: string
    light: string
    hint: string
    description: string
    disabled?: string
  }

  interface PaletteColorOptions {
    light?: string
    main?: string
    dark?: string
    contrastText?: string
  }

  interface TypeBackground {
    default: string
    paper: string
    primary: string
    secondary: string
    tertiary: string
    dark: string
    light?: string
    alert?: string
    lightGrey?: string
  }

  interface TypeChart {
    red: string
    yellow: string
    orange: string
    green: string
    blue: string
  }
}
