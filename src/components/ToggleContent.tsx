import React, { useEffect, useState } from 'react'

interface ToggleContentProps {
  content: React.FunctionComponent<{
    hide: () => void
    isShown: boolean
    toggleHandler: () => void
  }>
  toggle: (show: () => void) => void
  open?: boolean // Expose ability to control component via external state
}

const ToggleContent: React.FunctionComponent<ToggleContentProps> = (props) => {
  const { toggle, content, open } = props
  const [isShown, setIsShown] = useState(open)
  const hide = () => setIsShown(false)
  const show = () => setIsShown(true)
  const toggleHandler = () => setIsShown(!isShown)

  useEffect(() => {
    setIsShown(open)
  }, [open])

  return (
    <>
      {toggle(show)}
      {isShown && content({ hide, isShown, toggleHandler })}
    </>
  )
}

export default ToggleContent
