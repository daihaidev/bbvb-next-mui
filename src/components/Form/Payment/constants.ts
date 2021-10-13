import useTheme from '@material-ui/core/styles/useTheme'

export const useGetCardElementStyle = () => {
  const theme = useTheme()

  return {
    style: {
      base: {
        fontFamily: theme.typography.body1.fontFamily,
        fontWeight: 'lighter',
        '::placeholder': {
          color: theme.palette.text.hint,
        },
      },
      invalid: {
        color: theme.palette.error.main,
        iconColor: theme.palette.error.main,
      },
    },
  }
}
