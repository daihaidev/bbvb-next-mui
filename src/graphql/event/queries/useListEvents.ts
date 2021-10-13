import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListEventsQuery, ListEventsQueryVariables, listEvents as listEventsQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListEvents = (args: QueryHookOptions<ListEventsQuery, ListEventsQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listEventsQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const events = data?.listEvents?.items ?? []

  return {
    events,
    ...rest,
  }
}

export default useListEvents
