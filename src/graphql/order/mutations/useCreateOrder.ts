import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  CreateOrderMutation,
  CreateOrderMutationVariables,
  CreateOrderInput,
  createOrder as createOrderMutation,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useCreateOrder = (args: MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables> = {}) => {
  const [createOrder, onOrderCreated] = useMutation(gql(createOrderMutation), args)

  const handleCreateOrder = (input: CreateOrderInput) => {
    return createOrder({ variables: { input: sanitizeData(input) } })
  }

  return { handleCreateOrder, onOrderCreated }
}

export default useCreateOrder
