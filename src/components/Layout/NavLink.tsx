import React from 'react'
import Link from 'next/link'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Box, Icon, Typography, Theme } from '@material-ui/core'
import { useRouter } from 'next/router'

interface NavLinkProps {
  label: string
  route: string
  icon?: any
  color?: string
}

interface NavLinkStyles {
  isActive: boolean
}

const useStyles = makeStyles<Theme, NavLinkStyles>((theme) => ({
  linkWrapper: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: theme.spacing(0.25, 1),
    '&:hover': {
      '& > *': {
        color: theme.palette.secondary.main,
      },
    },
  },
  linkIcon: {
    color: ({ isActive }) => (isActive ? theme.palette.secondary.main : theme.palette.primary.contrastText),
    marginRight: theme.spacing(1.5),
  },
  link: {
    color: ({ isActive }) => (isActive ? theme.palette.secondary.main : theme.palette.primary.contrastText),
  },
}))

const NavLink: React.FC<NavLinkProps> = (props) => {
  const router = useRouter()

  const { label, route, icon, color } = props
  const isActive = router.pathname === route
  const classes = useStyles({ isActive })

  return (
    <Link href={route} passHref>
      <Box component="a" className={classes.linkWrapper} color={color}>
        {icon && <Icon className={classes.linkIcon} component={icon} />}
        <Typography className={classes.link} variant="h6" component="div">
          <Box color={color}>{label}</Box>
        </Typography>
      </Box>
    </Link>
  )
}

export default NavLink
