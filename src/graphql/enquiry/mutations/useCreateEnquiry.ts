import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  CreateEnquiryMutation,
  CreateCartItemMutationVariables,
  CreateEnquiryInput,
  createEnquiry as createEnquiryMutation,
} from '@onextech/etc-api'
import { sanitizeData } from '../../../utils/data'

const useCreateEnquiry = (args: MutationHookOptions<CreateEnquiryMutation, CreateCartItemMutationVariables> = {}) => {
  const [createEnquiry, onEnquiryCreated] = useMutation(gql(createEnquiryMutation), args)

  const handleCreateEnquiry = (input: CreateEnquiryInput) => {
    return createEnquiry({ variables: { input: sanitizeData(input) } })
  }

  return { handleCreateEnquiry, onEnquiryCreated }
}

export default useCreateEnquiry
