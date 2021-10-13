import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  UpdateDiscountMutation,
  UpdateDiscountMutationVariables,
  UpdateDiscountInput,
  updateDiscount as updateDiscountMutation,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useUpdateDiscount = (args: MutationHookOptions<UpdateDiscountMutation, UpdateDiscountMutationVariables> = {}) => {
  const [updateDiscount, onDiscountUpdated] = useMutation(gql(updateDiscountMutation), args)

  const handleUpdateDiscount = (input: UpdateDiscountInput) => {
    return updateDiscount({ variables: { input: sanitizeData(input) } })
  }

  return { handleUpdateDiscount, onDiscountUpdated }
}

export default useUpdateDiscount
