import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  CreateCartItemMutation,
  CreateUserMutationVariables,
  createCartItem as createCartItemMutation,
  CreateCartItemInput,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useCreateCartItem = (args: MutationHookOptions<CreateCartItemMutation, CreateUserMutationVariables> = {}) => {
  const [createCartItem, onCartItemCreated] = useMutation(gql(createCartItemMutation), args)

  const handleCreateCartItem = async (input: CreateCartItemInput) => {
    const onCreateCartItem = await createCartItem({ variables: { input: sanitizeData(input) } })
    return onCreateCartItem
  }

  return {
    handleCreateCartItem,
    onCartItemCreated,
  }
}

export default useCreateCartItem
