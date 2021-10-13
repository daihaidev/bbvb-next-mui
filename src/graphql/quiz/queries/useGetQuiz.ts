import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetQuizQuery, GetQuizQueryVariables, getQuiz as getQuizQuery } from '@onextech/vts-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetQuiz = (args: QueryHookOptions<GetQuizQuery, GetQuizQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getQuizQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const quiz = data?.getQuiz

  return {
    quiz,
    ...rest,
  }
}

export default useGetQuiz
