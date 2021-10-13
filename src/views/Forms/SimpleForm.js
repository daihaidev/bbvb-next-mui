import React, { useState, useEffect } from 'react'
import RouterLink from 'next/link'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, TextField, Button, Link, Checkbox, FormHelperText, Typography } from '@material-ui/core'

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
  },
}

const useStyles = makeStyles((theme) => ({
  root: {},
  policy: {
    display: 'flex',
    alignItems: 'center',
  },
  policyCheckbox: {
    marginLeft: '-14px',
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}))

function SimpleForm({ className, ...rest }) {
  const classes = useStyles()
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  })

  const handleChange = (event) => {
    event.persist()

    setFormState((prevFormState) => ({
      ...prevFormState,
      values: {
        ...prevFormState.values,
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      },
      touched: {
        ...prevFormState.touched,
        [event.target.name]: true,
      },
    }))
  }

  const hasError = (field) => Boolean(formState.touched[field] && formState.errors[field])

  useEffect(() => {
    const errors = validate(formState.values, schema)

    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }))
  }, [formState.values])

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <form autoComplete="off">
          <TextField
            error={hasError('email')}
            fullWidth
            helperText={hasError('email') ? formState.errors.email[0] : null}
            label="Email address"
            margin="normal"
            name="email"
            onChange={handleChange}
            value={formState.values.email || ''}
            variant="outlined"
          />
          <TextField
            error={hasError('password')}
            fullWidth
            helperText={hasError('password') ? formState.errors.password[0] : null}
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={formState.values.password || ''}
            variant="outlined"
          />
          <div className={classes.policy}>
            <Checkbox
              checked={formState.values.policy || false}
              className={classes.policyCheckbox}
              color="primary"
              name="policy"
              onChange={handleChange}
            />
            <Typography color="textSecondary" variant="body1">
              I have read the{' '}
              <RouterLink href="#" passHref>
                <Link color="secondary" component="a" underline="always" variant="h6">
                  Terms and Conditions
                </Link>
              </RouterLink>
            </Typography>
          </div>
          {hasError('policy') && <FormHelperText error>{formState.errors.policy[0]}</FormHelperText>}
          <Button
            className={classes.submitButton}
            color="secondary"
            disabled={!formState.isValid}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Click to Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

SimpleForm.propTypes = {
  className: PropTypes.string,
}

export default SimpleForm
