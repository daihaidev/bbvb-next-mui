import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetCategoryQuery, GetCategoryQueryVariables, getCategory as getCategoryQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetCategory = (args: QueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getCategoryQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const category = data?.getCategory

  return {
    category,
    ...rest,
  }
}

export default useGetCategory
