import { TypographyOptions } from '@material-ui/core/styles/createTypography'
import palette from './palette'

const typography: TypographyOptions = {
  fontFamily: 'Rubik',
  h1: {
    fontSize: 48,
    color: palette.text.primary,
    fontWeight: 700,
  },
  h2: {
    fontSize: 36,
    color: palette.text.primary,
    fontWeight: 700,
  },
  h3: {
    fontSize: 24,
    color: palette.text.primary,
    fontWeight: 700,
  },
  h4: {
    fontSize: 21,
    color: palette.text.primary,
    fontWeight: 700,
  },
  h5: {
    fontSize: 16,
    color: palette.text.primary,
    fontWeight: 700,
  },
  h6: {
    fontSize: 14,
    color: palette.text.primary,
    fontWeight: 500,
  },
  body1: {
    fontSize: 20,
    color: palette.text.primary,
    fontWeight: 400,
  },
  body2: {
    fontSize: 18,
    color: palette.text.primary,
    fontWeight: 400,
  },
  subtitle1: {
    fontSize: 16,
    color: palette.text.primary,
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: 21,
    color: palette.text.primary,
    fontWeight: 400,
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    color: palette.primary.contrastText,
    textTransform: 'none',
  },
  overline: {
    fontSize: 14,
    fontWeight: 800,
    color: palette.text.tertiary,
    textTransform: 'none',
  },
  caption: {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: palette.text.primary,
  },
}

export default typography
