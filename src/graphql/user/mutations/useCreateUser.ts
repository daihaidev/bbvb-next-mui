import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  CreateUserInput,
  createUser as createUserMutation,
} from '@onextech/btb-api'
import { sanitizeData } from '../../../utils/data'

const useCreateUser = (args: MutationHookOptions<CreateUserMutation, CreateUserMutationVariables> = {}) => {
  const [createUser, onUserCreated] = useMutation(gql(createUserMutation), args)

  const handleCreateUser = (input: CreateUserInput) => {
    return createUser({ variables: { input: sanitizeData(input) } })
  }

  return { handleCreateUser, onUserCreated }
}

export default useCreateUser
