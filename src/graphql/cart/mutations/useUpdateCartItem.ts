import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables,
  updateCartItem as updateCartItemMutation,
  UpdateCartItemInput,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useUpdateCartItem = (args: MutationHookOptions<UpdateCartItemMutation, UpdateCartItemMutationVariables> = {}) => {
  const [updateCartItem, onCartItemUpdated] = useMutation(gql(updateCartItemMutation), args)

  const handleUpdateCartItem = async (input: UpdateCartItemInput) => {
    const onUpdateCartItem = await updateCartItem({ variables: { input: sanitizeData(input) } })
    return onUpdateCartItem
  }

  return {
    handleUpdateCartItem,
    onCartItemUpdated,
  }
}

export default useUpdateCartItem
