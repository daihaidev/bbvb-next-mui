import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UpdateUserInput,
  updateUser as updateUserMutation,
} from '@onextech/btb-api'
import { sanitizeData } from '../../../utils/data'

const useUpdateUser = (args: MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables> = {}) => {
  const [updateUser, onUserUpdated] = useMutation(gql(updateUserMutation), args)

  const handleUpdateUser = (input: UpdateUserInput) => {
    return updateUser({ variables: { input: sanitizeData(input) } })
  }

  return { handleUpdateUser, onUserUpdated }
}

export default useUpdateUser
