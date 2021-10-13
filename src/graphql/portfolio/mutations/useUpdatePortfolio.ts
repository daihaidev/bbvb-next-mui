import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  UpdatePortfolioMutation,
  UpdatePortfolioMutationVariables,
  UpdatePortfolioInput,
  updatePortfolio as updatePortfolioMutation,
} from '@onextech/btb-api'
import { sanitizeData } from '../../../utils/data'

const useUpdatePortfolio = (
  args: MutationHookOptions<UpdatePortfolioMutation, UpdatePortfolioMutationVariables> = {}
) => {
  const [updatePortfolio, onPortfolioUpdated] = useMutation(gql(updatePortfolioMutation), args)

  const handleUpdatePortfolio = (input: UpdatePortfolioInput) => {
    return updatePortfolio({ variables: { input: sanitizeData(input) } })
  }

  return { handleUpdatePortfolio, onPortfolioUpdated }
}

export default useUpdatePortfolio
