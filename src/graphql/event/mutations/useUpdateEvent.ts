import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  UpdateEventMutation,
  UpdateEventMutationVariables,
  updateEvent as updateEventMutation,
  UpdateEventInput,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useUpdateEvent = (args: MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables> = {}) => {
  const [updateEvent, onEventUpdated] = useMutation(gql(updateEventMutation), args)

  const handleUpdateEvent = async (input: UpdateEventInput) => {
    const onUpdateEvent = await updateEvent({ variables: { input: sanitizeData(input) } })
    return onUpdateEvent
  }

  return {
    handleUpdateEvent,
    onEventUpdated,
  }
}

export default useUpdateEvent
