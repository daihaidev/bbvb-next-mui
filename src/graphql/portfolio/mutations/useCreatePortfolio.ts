import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  CreatePortfolioMutation,
  CreatePortfolioMutationVariables,
  CreatePortfolioInput,
  createPortfolio as createPortfolioMutation,
} from '@onextech/btb-api'
import { sanitizeData } from '../../../utils/data'

const useCreatePortfolio = (
  args: MutationHookOptions<CreatePortfolioMutation, CreatePortfolioMutationVariables> = {}
) => {
  const [createPortfolio, onPortfolioCreated] = useMutation(gql(createPortfolioMutation), args)

  const handleCreatePortfolio = (input: CreatePortfolioInput) => {
    return createPortfolio({ variables: { input: sanitizeData(input) } })
  }

  return { handleCreatePortfolio, onPortfolioCreated }
}

export default useCreatePortfolio
