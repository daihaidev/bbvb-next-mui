import React, { useMemo, useState } from 'react'
import zipObject from 'lodash/zipObject'
import {
  Box,
  ExpansionPanel as MuiExpansionPanel,
  ExpansionPanelSummary as MuiExpansionPanelSummary,
  ExpansionPanelDetails as MuiExpansionPanelDetails,
  Typography,
} from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

// Referenced from https://material-ui.com/components/expansion-panels/#customized-expansion-panels

interface AccordionProps {
  items: Array<{ label: string; content: React.ReactNode; hidden?: boolean }>
  defaultOpen?: boolean
  disabled?: boolean
  variant?: 'default' | 'outlined'
}

// TODO: Shift hard-coded colours to palette
const useStyles = makeStyles((theme) => ({
  default: {
    '& > .MuiExpansionPanel-root': {
      '&:not(:first-child)': {
        borderTop: `1px solid ${theme.palette.divider}`,
      },
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '& > .MuiExpansionPanelSummary-root': {
        // Ensure that rotation is performed only by the icon and not its wrapper(s), otherwise the border can be seen to be rotating
        transform: 'none',
        transition: 'unset',
        '& .MuiExpansionPanelSummary-expandIcon': {
          '& .MuiIconButton-label': {
            color: theme.palette.secondary.contrastText,
            borderRadius: theme.shape.borderRadius,
            '& .MuiSvgIcon-root': {
              transform: 'rotate(0deg)',
              transition: `transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
            },
          },
        },
        '&.Mui-expanded': {
          '& .MuiExpansionPanelSummary-expandIcon': {
            transform: 'none',
            '& .MuiIconButton-label': {
              '& .MuiSvgIcon-root': {
                transform: 'rotate(180deg)',
              },
            },
          },
        },
      },
    },
  },
  outlined: {
    '& > .MuiExpansionPanel-root': {
      backgroundColor: '#fbfbfb',
      padding: theme.spacing(1.625, 2, 0, 4.125),
      border: '1px solid #969fba',
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2),
      '&.Mui-expanded': {
        paddingBottom: theme.spacing(1.625),
      },
      '& .MuiExpansionPanelSummary-root': {
        marginBottom: theme.spacing(1.625),
        '& .MuiExpansionPanelSummary-content': {
          margin: 0,
        },
        '& .MuiExpansionPanelSummary-expandIcon': {
          paddingTop: 0,
          paddingBottom: 0,
          color: '#c1c5d3',
        },
      },
    },
  },
}))

const ExpansionPanel = withStyles({
  root: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
  },
  disabled: {
    '&$disabled': {
      backgroundColor: 'transparent',
    },
  },
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles((theme) => ({
  root: {
    minHeight: 'unset',
    padding: 0,
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  disabled: {
    '&$disabled': {
      opacity: 1,
      '& > .MuiExpansionPanelSummary-expandIcon': {
        display: 'none',
      },
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {
    '&&': {
      minHeight: 'unset',
    },
  },
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles({
  root: {
    display: 'block',
    padding: 0,
    backgroundColor: 'transparent',
  },
})(MuiExpansionPanelDetails)

const getPanelKey = (index) => `panel${index}`

const Accordion: React.FC<AccordionProps> = (props) => {
  const { items, variant = 'default', defaultOpen, disabled } = props
  const classes = useStyles({})

  const initialPanelsExpandedState = useMemo(() => {
    const panelKeys = items.map((_, i) => getPanelKey(i))
    return zipObject(
      panelKeys,
      Array.from({ length: items.length }).map(() => defaultOpen || disabled || false)
    )
  }, [])
  const [expandedPanels, setExpandedPanels] = useState(initialPanelsExpandedState)

  const onPanelExpandedChange = (panelKey: string) => (event, isExpanded) => {
    setExpandedPanels({ ...expandedPanels, [panelKey]: isExpanded })
  }

  return (
    <Box className={classes[variant]}>
      {items.map(({ label, content, hidden = false }, i) => {
        const panelKey = getPanelKey(i)
        const isExpanded = expandedPanels[panelKey]

        if (hidden) return null
        return (
          <ExpansionPanel disabled={disabled} square expanded={isExpanded} onChange={onPanelExpandedChange(panelKey)}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon fontSize={variant === 'default' ? 'large' : 'default'} />}
              IconButtonProps={{ disableRipple: true }}
            >
              <Typography variant={variant === 'default' ? 'h4' : 'body2'} color="inherit">
                {label}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>{content}</ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </Box>
  )
}

export default Accordion
