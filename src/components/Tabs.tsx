import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Tabs as MuiTabs, Tab as MuiTab, Theme } from '@material-ui/core'

interface TabsProps {
  items: string[]
  value: number
  onChange: (event: any, newTab: any) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  tab: {
    padding: theme.spacing(0.75, 0.5, 0),
    marginRight: theme.spacing(1.5),
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.light,
    minWidth: 'unset',
    '&.Mui-selected': {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
  },
  indicator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.palette.text.primary,
  },
}))

const Tabs: React.FC<TabsProps> = (props) => {
  const { items, value, onChange } = props
  const classes = useStyles()

  return (
    <MuiTabs TabIndicatorProps={{ className: classes.indicator }} value={value} onChange={onChange}>
      {items.map((item) => (
        <MuiTab key={item} className={classes.tab} label={item} />
      ))}
    </MuiTabs>
  )
}

export default Tabs
