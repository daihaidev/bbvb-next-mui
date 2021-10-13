import React from 'react'

type FormProps = React.HTMLAttributes<HTMLFormElement>

const Form: React.FC<FormProps> = (props) => {
  return <form {...props} />
}

export default Form
