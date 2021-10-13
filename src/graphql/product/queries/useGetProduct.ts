import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetProductQuery, GetProductQueryVariables, getProduct as getProductQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetProduct = (args: QueryHookOptions<GetProductQuery, GetProductQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getProductQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const product = data?.getProduct

  return {
    product,
    ...rest,
  }
}

export default useGetProduct
