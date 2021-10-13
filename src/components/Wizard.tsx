import React, { useCallback, useMemo, useState } from 'react'
import kebabCase from 'lodash/kebabCase'
import { Step, StepLabel, Stepper as MuiStepper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  stepper: {
    padding: 0,
    backgroundColor: 'unset',
  },
  step: {
    flex: '1 1 0', // Works together with `minWidth` to ensure that all steps are of equal width @link: https://stackoverflow.com/a/44782536
    minWidth: 0, // Works together with `flex` to ensure that all steps are of equal width @link: https://stackoverflow.com/a/44782536
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    '& .MuiStepConnector-root': {
      top: 13,
      left: 'calc(-50% - 50px)',
      right: 'calc(50% - 50px)',
      [theme.breakpoints.up('sm')]: {
        top: 17,
      },
      [theme.breakpoints.up('md')]: {
        top: 22,
      },
      '& .MuiStepConnector-line': {
        borderWidth: 7,
        borderColor: '#cbd3ee',
        borderRadius: 50,
      },
    },
    '& .MuiStepLabel-root': {
      position: 'relative',
      zIndex: 1, // bring it in front of connector
      '& .MuiStepIcon-root': {
        fontSize: '2rem',
        color: theme.palette.common.white,
        border: '1px solid #c2cae2',
        borderRadius: '50%',
        transition: `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
        transitionProperty: 'color, border-color',
        [theme.breakpoints.up('sm')]: {
          fontSize: '2.5rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '3.25rem',
        },
        '&.MuiStepIcon-active': {
          color: '#ffcb46',
          borderColor: '#f0ad17',
        },
      },
      '& .MuiStepIcon-text': {
        fill: theme.palette.primary.light,
        fontWeight: 600,
      },
      '& .MuiStepLabel-label': {
        marginTop: theme.spacing(1),
        color: theme.palette.common.white,
        fontWeight: 500,
        [theme.breakpoints.down('xs')]: {
          fontSize: theme.typography.caption.fontSize,
        },
      },
    },
  },
}))

const Wizard = (props) => {
  const { steps, children } = props
  const classes = useStyles({})

  const [activeStep, setActiveStep] = useState(0)

  const next = useCallback(() => {
    const nextActiveStep = activeStep + 1
    setActiveStep(nextActiveStep >= steps.length ? steps.length - 1 : nextActiveStep)
    window.scrollTo(0, 0)
  }, [steps.length, activeStep, setActiveStep])

  const prev = useCallback(() => {
    const nextActiveStep = activeStep - 1
    setActiveStep(nextActiveStep <= 0 ? 0 : nextActiveStep)
    window.scrollTo(0, 0)
  }, [activeStep, setActiveStep])

  const reset = () => setActiveStep(0)

  const activeStepContent = useMemo(() => {
    const { render } = steps[activeStep]
    return typeof render === 'function' ? render({ next, prev, reset }) : render
  }, [steps, activeStep])

  const stepper = useMemo(() => {
    return (
      <MuiStepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
        {steps.map(({ label, step }) => (
          <Step key={kebabCase(label)} completed={false} className={classes.step} {...step}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
    )
  }, [steps, activeStep])

  return (
    <div>
      {typeof children === 'function' ? (
        children({ stepper, content: activeStepContent, activeStepIndex: activeStep, next, prev })
      ) : (
        <>
          {stepper}
          {activeStepContent}
        </>
      )}
    </div>
  )
}

export default Wizard
