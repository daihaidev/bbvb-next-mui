import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetVariantQuery, GetVariantQueryVariables, getVariant as getVariantQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetVariant = (args: QueryHookOptions<GetVariantQuery, GetVariantQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getVariantQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const variant = data?.getVariant

  return {
    variant,
    ...rest,
  }
}

export default useGetVariant
