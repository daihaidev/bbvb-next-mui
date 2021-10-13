import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Container, Theme } from '@material-ui/core'
/**
 * Fix issues with SSR
 * (Require Editor JS files)
 * @link https://github.com/froala/react-froala-wysiwyg/issues/35
 */
const FroalaEditorView = typeof window === 'undefined' ? null : require('react-froala-wysiwyg/FroalaEditorView').default

const useStyles = makeStyles((theme: Theme) => ({
  removeFroalaAttribution: {
    padding: 0,
    '& p[data-f-id="pbf"]': {
      display: 'none',
    },
  },
}))

interface WysiwygViewProps {
  content: string
}

const WysiwygView: React.FunctionComponent<WysiwygViewProps> = (props) => {
  const { content } = props
  const classes = {
    ...useStyles(),
  }

  if (FroalaEditorView) {
    return (
      <Box>
        <Container className={classes.removeFroalaAttribution}>
          <FroalaEditorView
            model={content}
            config={{
              attribution: false,
            }}
          />
        </Container>
      </Box>
    )
  }

  // SSR render
  return (
    <Box>
      <Container>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
    </Box>
  )
}

export default WysiwygView
