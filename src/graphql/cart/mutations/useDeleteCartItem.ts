import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  DeleteCartItemMutation,
  DeleteCartItemMutationVariables,
  deleteCartItem as deleteCartItemMutation,
  DeleteCartItemInput,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useDeleteCartItem = (args: MutationHookOptions<DeleteCartItemMutation, DeleteCartItemMutationVariables> = {}) => {
  const [deleteCartItem, onCartItemDeleted] = useMutation(gql(deleteCartItemMutation), args)

  const handleDeleteCartItem = async (input: DeleteCartItemInput) => {
    const onDeleteCartItem = await deleteCartItem({ variables: { input: sanitizeData(input) } })
    return onDeleteCartItem
  }

  return {
    handleDeleteCartItem,
    onCartItemDeleted,
  }
}

export default useDeleteCartItem
