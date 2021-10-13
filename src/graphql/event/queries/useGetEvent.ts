import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetEventQuery, GetEventQueryVariables, getEvent as getEventQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetEvent = (args: QueryHookOptions<GetEventQuery, GetEventQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getEventQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const event = data?.getEvent

  return {
    event,
    ...rest,
  }
}

export default useGetEvent
