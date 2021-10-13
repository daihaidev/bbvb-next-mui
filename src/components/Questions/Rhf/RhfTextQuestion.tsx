import React from 'react'
import RhfTextField from '../../Form/Rhf/RhfTextField'
import QuestionFormControl from '../QuestionFormControl'
import QuestionLabel from '../QuestionLabel'

// Renders a Text Question with react-hook-form

type TextQuestionProps = React.ComponentProps<typeof RhfTextField> & {
  title: string
  error?: boolean
}

const RhfTextQuestion: React.FC<TextQuestionProps> = (props) => {
  const { title, error, ...rest } = props

  return (
    <QuestionFormControl error={error}>
      <QuestionLabel>{title}</QuestionLabel>
      {/*
        // @ts-ignore */}
      <RhfTextField variant="outlined" size="small" {...rest} />
    </QuestionFormControl>
  )
}

export default RhfTextQuestion
